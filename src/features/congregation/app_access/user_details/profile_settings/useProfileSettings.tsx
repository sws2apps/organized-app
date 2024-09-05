import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { UsersOption } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import {
  personIsBaptizedPublisher,
  personIsMidweekStudent,
  personIsUnbaptizedPublisher,
} from '@services/app/persons';
import useUserDetails from '../useUserDetails';

const useProfileSettings = () => {
  const { t } = useAppTranslation();

  const { handleSaveDetails, user } = useUserDetails();

  const personsActive = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [delegatedPersons, setDelegatedPersons] = useState<UsersOption[]>([]);

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

  const delegateOptions = useMemo(() => {
    return persons.filter(
      (record) => record.person_uid !== user.user_local_uid
    );
  }, [persons, user]);

  const handleSelectPerson = async (value: UsersOption) => {
    try {
      setSelectedPerson(value);

      const newUser = structuredClone(user);
      newUser.user_local_uid = value.person_uid;

      if (
        newUser.cong_role.includes('admin') &&
        newUser.cong_role.length === 1
      ) {
        const person = personsActive.find(
          (record) => record.person_uid === value.person_uid
        );

        if (personIsMidweekStudent(person)) {
          newUser.cong_role.push('view_schedules');
        }

        const isPublisher =
          personIsBaptizedPublisher(person) ||
          personIsUnbaptizedPublisher(person);

        if (isPublisher) {
          newUser.cong_role.push('publisher', 'view_schedules');
        }
      }

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDelegatedPersonsChange = async (value: UsersOption[]) => {
    try {
      setDelegatedPersons(value);

      const persons = value.map((record) => record.person_uid);

      const newUser = structuredClone(user);
      newUser.user_delegates = persons;

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDeletePerson = async (value: UsersOption) => {
    try {
      const values = delegatedPersons.filter(
        (record) => record.person_uid !== value.person_uid
      );

      setDelegatedPersons(values);

      const newUser = structuredClone(user);
      newUser.user_delegates = values.map((record) => record.person_uid);

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setSelectedPerson(null);
    setDelegatedPersons([]);

    const person = personsActive.find(
      (record) => record.person_uid === user.user_local_uid
    );

    if (person) {
      setSelectedPerson({
        person_uid: person.person_uid,
        person_name: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      });
    }

    const delegates: UsersOption[] = [];

    for (const person of user.user_delegates) {
      const found = personsActive.find(
        (record) => record.person_uid === person
      );

      if (found) {
        delegates.push({
          person_uid: found.person_uid,
          person_name: buildPersonFullname(
            found.person_data.person_lastname.value,
            found.person_data.person_firstname.value,
            fullnameOption
          ),
        });
      }
    }

    setDelegatedPersons(delegates);
  }, [user, personsActive, fullnameOption]);

  return {
    persons,
    selectedPerson,
    handleSelectPerson,
    delegatedPersons,
    handleDelegatedPersonsChange,
    handleDeletePerson,
    delegateOptions,
  };
};

export default useProfileSettings;
