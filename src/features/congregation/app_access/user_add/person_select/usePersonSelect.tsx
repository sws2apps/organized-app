import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import randomString from '@smakss/random-string';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
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
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  apiAdminGlobalSearchUser,
  apiCreateUser,
  apiGetCongregationAccessCode,
  apiPocketUserCreate,
} from '@services/api/congregation';
import { decryptData, encryptData } from '@services/encryption';
import { isEmailValid } from '@services/validator';
import { congregationUsersState } from '@states/app';
import usePerson from '@features/persons/hooks/usePerson';

const usePersonSelect = ({
  onSetStep,
  onSetUser,
  onClose,
}: PersonSelectType) => {
  const { t } = useAppTranslation();

  const {
    personIsBaptizedPublisher,
    personIsMidweekStudent,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
  } = usePerson();

  const setUsers = useSetAtom(congregationUsersState);

  const personsDb = useAtomValue(personsState);
  const personsActive = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const countryCode = useAtomValue(countryCodeState);
  const congNumber = useAtomValue(congNumberState);
  const congLocalAccessCode = useAtomValue(congAccessCodeState);
  const dataSync = useAtomValue(congDataSyncState);

  const [userType, setUserType] = useState<UserType>('baptized');
  const [email, setEmail] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchStatus, setSearchStatus] = useState<boolean>(null);
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(null);

  const persons: UsersOption[] = useMemo(() => {
    let result: PersonType[] = [];

    if (userType === 'baptized') {
      result = personsActive.filter((person) => {
        if (person.person_data.female.value) return false;

        const isBaptized = personIsBaptizedPublisher(person);
        return isBaptized;
      });
    }

    if (userType === 'publisher') {
      result = personsActive.filter((person) => {
        if (person.person_data.female.value) return true;

        const isBaptized = personIsBaptizedPublisher(person);
        return !isBaptized;
      });
    }

    return result.map((person) => {
      return {
        person_uid: person.person_uid,
        person_name: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      };
    });
  }, [personsActive, fullnameOption, personIsBaptizedPublisher, userType]);

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

      let code: string;

      const { message, status } = await apiGetCongregationAccessCode();

      if (status !== 200) {
        throw new Error(message);
      }

      const remoteAccessCode = decryptData(
        message,
        congLocalAccessCode,
        'access_code'
      );

      if (userType === 'publisher') {
        code = `${countryCode}${congNumber}-`;
        code += randomString({
          length: 6,
          allowedCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        });
        code += `-${congLocalAccessCode}`;

        const users = await apiPocketUserCreate({
          cong_person_uid: person.person_uid,
          cong_role,
          user_firstname: person.person_data.person_firstname.value,
          user_lastname: person.person_data.person_lastname.value,
          user_secret_code: encryptData(code, remoteAccessCode),
        });

        setUsers(users);
      }

      if (userType === 'baptized') {
        const users = await apiCreateUser({
          cong_person_uid: person?.person_uid || '',
          cong_role,
          user_firstname: person?.person_data.person_firstname.value || '',
          user_lastname: person?.person_data.person_lastname.value || '',
          user_id: userId,
        });

        setUsers(users);
      }

      if (userType === 'baptized') {
        onClose();
      }

      if (userType === 'publisher') {
        onSetUser(selectedPerson.person_name, code);
        onSetStep();
      }
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      displaySnackNotification({
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

      displaySnackNotification({
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
