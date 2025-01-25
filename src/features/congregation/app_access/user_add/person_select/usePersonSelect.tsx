import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import randomString from '@smakss/random-string';
import { useAppTranslation } from '@hooks/index';
import { personsActiveState, personsState } from '@states/persons';
import { PersonSelectType, UsersOption, UserType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import {
  congAccessCodeState,
  congDataSyncState,
  congNumberState,
  countryCodeState,
  fullnameOptionState,
} from '@states/settings';
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
import { APICongregationUserType } from '@definition/api';
import { congregationUsersState } from '@states/app';
import usePerson from '@features/persons/hooks/usePerson';

const usePersonSelect = ({
  onSetStep,
  onSetUser,
  onClose,
}: PersonSelectType) => {
  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const {
    personIsBaptizedPublisher,
    personIsMidweekStudent,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
  } = usePerson();

  const setUsers = useSetRecoilState(congregationUsersState);

  const personsDb = useRecoilValue(personsState);
  const personsActive = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const countryCode = useRecoilValue(countryCodeState);
  const congNumber = useRecoilValue(congNumberState);
  const congLocalAccessCode = useRecoilValue(congAccessCodeState);
  const dataSync = useRecoilValue(congDataSyncState);

  const [userType, setUserType] = useState<UserType>('baptized');
  const [email, setEmail] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchStatus, setSearchStatus] = useState<boolean>(null);
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(null);

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
    if (userType === 'publisher' && selectedPerson === null) return;

    try {
      setIsProcessing(true);

      const person = personsDb.find(
        (record) => record.person_uid === selectedPerson?.person_uid
      );

      const cong_role: string[] = [];

      if (person) {
        const person = personsDb.find(
          (record) => record.person_uid === selectedPerson.person_uid
        );

        const isMidweekStudent = personIsMidweekStudent(person);

        const isPublisher =
          personIsBaptizedPublisher(person) ||
          personIsUnbaptizedPublisher(person);

        const isElder = personIsPrivilegeActive(person, 'elder');
        const isMS = personIsPrivilegeActive(person, 'ms');

        if (isMidweekStudent || isPublisher) {
          cong_role.push('view_schedules');
        }

        if (isPublisher) {
          cong_role.push('publisher');
        }

        if (isElder) {
          cong_role.push('elder');
        }

        if (isMS) {
          cong_role.push('ms');
        }
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
          cong_person_uid: person?.person_uid || '',
          cong_role,
          user_firstname: person?.person_data.person_firstname.value || '',
          user_lastname: person?.person_data.person_lastname.value || '',
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

      await queryClient.invalidateQueries({ queryKey: ['congregation_users'] });
      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

      const data: APICongregationUserType = queryClient.getQueryData([
        'congregation_users',
      ]);

      setUsers(data?.users || []);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleSearchUser = async () => {
    setSearchStatus(null);

    if (email.length === 0) {
      setIsEmailEmpty(true);
      setSearchStatus(false);
      return;
    }
    setIsEmailEmpty(false);

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
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleRunAction = async () => {
    if (userType === 'publisher' || (userType === 'baptized' && searchStatus)) {
      await handleCreateUser();
      return;
    }

    if (userType === 'baptized' && userId.length === 0) {
      await handleSearchUser();
    }
  };

  const handleSecondaryAction = () => {
    if (userType === 'baptized' && userId.length > 0) {
      setSearchStatus(null);
      setUserId('');
      return;
    }
    onClose();
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
    handleSecondaryAction,
    isProcessing,
    isEmailEmpty,
    searchStatus,
    dataSync,
  };
};

export default usePersonSelect;
