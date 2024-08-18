import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import randomString from '@smakss/random-string';
import { useAppTranslation } from '@hooks/index';
import { personsActiveState, personsState } from '@states/persons';
import { PersonSelectType, UsersOption, UserType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import {
  congAccessCodeState,
  congNumberState,
  countryCodeState,
  fullnameOptionState,
} from '@states/settings';
import {
  personIsBaptizedPublisher,
  personIsMidweekStudent,
  personIsUnbaptizedPublisher,
} from '@services/app/persons';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  apiAdminGlobalSearchUser,
  apiCreateUser,
  apiGetCongregationAccessCode,
  apiPocketUserCreate,
} from '@services/api/congregation';
import { decryptData, encryptData } from '@services/encryption';
import { isEmailValid } from '@services/validator';

const usePersonSelect = ({
  onSetStep,
  onSetUser,
  onClose,
}: PersonSelectType) => {
  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const personsDb = useRecoilValue(personsState);
  const personsActive = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const countryCode = useRecoilValue(countryCodeState);
  const congNumber = useRecoilValue(congNumberState);
  const congLocalAccessCode = useRecoilValue(congAccessCodeState);

  const [userType, setUserType] = useState<UserType>('baptized');
  const [email, setEmail] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchStatus, setSearchStatus] = useState<boolean>(null);

  const persons: UsersOption[] = useMemo(() => {
    return personsActive.map((person) => {
      return {
        person_uid: person.person_uid,
        person_name: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      };
    });
  }, [personsActive, fullnameOption]);

  const handleChangeUserType = (value: UserType) => setUserType(value);

  const handleEmailChange = (value: string) => setEmail(value);

  const handleSelectPerson = (value: UsersOption) => setSelectedPerson(value);

  const handleCreateUser = async () => {
    if (selectedPerson === null) return;

    try {
      setIsProcessing(true);

      const person = personsDb.find(
        (record) => record.person_uid === selectedPerson.person_uid
      );

      const cong_role: string[] = [];

      if (personIsMidweekStudent(person)) {
        cong_role.push('view_schedules');
      }

      const isPublisher =
        personIsBaptizedPublisher(person) ||
        personIsUnbaptizedPublisher(person);

      if (isPublisher) {
        cong_role.push('publisher', 'view_schedules');
      }

      let status: number, message: string, code: string;

      const remoteCode = await apiGetCongregationAccessCode();
      status = remoteCode.status;
      message = remoteCode.message;

      if (status !== 200) {
        throw new Error(message);
      }

      const remoteAccessCode = decryptData(message, congLocalAccessCode);

      if (userType === 'publisher') {
        code = `${countryCode}${congNumber}-`;
        code += randomString({
          length: 6,
          allowedCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        });
        code += `-${congLocalAccessCode}`;

        const result = await apiPocketUserCreate({
          cong_person_uid: person.person_uid,
          cong_role,
          user_firstname: person.person_data.person_firstname.value,
          user_lastname: person.person_data.person_lastname.value,
          user_secret_code: encryptData(code, remoteAccessCode),
        });

        status = result.status;
        message = result.message;
      }

      if (userType === 'baptized') {
        const result = await apiCreateUser({
          cong_person_uid: person.person_uid,
          cong_role,
          user_firstname: person.person_data.person_firstname.value,
          user_lastname: person.person_data.person_lastname.value,
          user_id: userId,
        });

        status = result.status;
        message = result.message;
      }

      if (status !== 200) {
        throw new Error(message);
      }

      if (userType === 'baptized') {
        onClose();
      }

      if (userType === 'publisher') {
        onSetUser(selectedPerson.person_name, code);
        onSetStep();
      }

      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleSearchUser = async () => {
    if (email.length === 0) return;

    setSearchStatus(null);

    try {
      setIsProcessing(true);

      if (!isEmailValid(email)) {
        throw new Error(t('tr_emailNotSupported'));
      }

      const { status, data } = await apiAdminGlobalSearchUser(email);

      if (status !== 200 && status !== 404) {
        throw new Error(data?.message);
      }

      if (status === 404) {
        setSearchStatus(false);
      }

      if (status === 200) {
        setSearchStatus(true);

        const userId = data.id as string;
        setUserId(userId);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleRunAction = async () => {
    if (
      userType === 'publisher' ||
      (userType === 'baptized' && userId.length > 0)
    ) {
      await handleCreateUser();
    }

    if (userType === 'baptized' && userId.length === 0) {
      await handleSearchUser();
    }
  };

  return {
    userType,
    handleChangeUserType,
    email,
    handleEmailChange,
    persons,
    selectedPerson,
    handleSelectPerson,
    handleRunAction,
    isProcessing,
    searchStatus,
  };
};

export default usePersonSelect;
