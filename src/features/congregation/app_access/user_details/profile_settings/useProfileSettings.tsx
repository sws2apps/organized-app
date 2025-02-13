import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonType } from '@definition/person';
import { personsActiveState } from '@states/persons';
import { UsersOption } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';
import usePerson from '@features/persons/hooks/usePerson';

const useProfileSettings = () => {
  const {
    personIsBaptizedPublisher,
    personIsMidweekStudent,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
  } = usePerson();

  const { handleSaveDetails, currentUser } = useUserDetails();

  const personsActive = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [delegatedPersons, setDelegatedPersons] = useState<UsersOption[]>([]);

  const available_persons = useMemo(() => {
    if (!currentUser) return [];

    let result: PersonType[] = [];

    if (currentUser.profile.global_role === 'pocket') {
      result = personsActive.filter((person) => {
        if (person.person_data.female.value) return true;

        const isBaptized = personIsBaptizedPublisher(person);
        return !isBaptized;
      });
    }

    if (currentUser.profile.global_role === 'vip') {
      result = personsActive.filter((person) => {
        if (person.person_data.female.value) return false;

        const isBaptized = personIsBaptizedPublisher(person);
        return isBaptized;
      });
    }

    return result;
  }, [personsActive, currentUser]);

  const persons: UsersOption[] = useMemo(() => {
    return available_persons.map((person) => {
      return {
        person_uid: person.person_uid,
        person_name: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      };
    });
  }, [available_persons, fullnameOption]);

  const delegateOptions = useMemo(() => {
    return persons.filter(
      (record) => record.person_uid !== currentUser.profile.user_local_uid
    );
  }, [persons, currentUser]);

  const handleSelectPerson = async (value: UsersOption) => {
    try {
      setSelectedPerson(value);

      const newUser = structuredClone(currentUser);
      newUser.profile.user_local_uid = value.person_uid;

      const userRole = newUser.profile?.cong_role || [];

      const person = personsActive.find(
        (record) => record.person_uid === value.person_uid
      );

      const isMidweekStudent = personIsMidweekStudent(person);

      const isPublisher =
        personIsBaptizedPublisher(person) ||
        personIsUnbaptizedPublisher(person);

      const isElder = personIsPrivilegeActive(person, 'elder');
      const isMS = personIsPrivilegeActive(person, 'ms');

      if (isMidweekStudent || isPublisher) {
        userRole.push('view_schedules');
      }

      if (isPublisher) {
        userRole.push('publisher');
      }

      if (isElder) {
        userRole.push('elder');
      }

      if (isMS) {
        userRole.push('ms');
      }

      newUser.profile.cong_role = Array.from(new Set(userRole));

      newUser.profile.firstname = {
        value: person.person_data.person_firstname.value,
        updatedAt: new Date().toISOString(),
      };

      newUser.profile.lastname = {
        value: person.person_data.person_lastname.value,
        updatedAt: new Date().toISOString(),
      };

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDelegatedPersonsChange = async (value: UsersOption[]) => {
    try {
      setDelegatedPersons(value);

      const persons = value.map((record) => record.person_uid);

      const newUser = structuredClone(currentUser);
      newUser.profile.user_members_delegate = persons;

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
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

      const newUser = structuredClone(currentUser);
      newUser.profile.user_members_delegate = values.map(
        (record) => record.person_uid
      );

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setSelectedPerson(null);
    setDelegatedPersons([]);

    const person = personsActive.find(
      (record) => record.person_uid === currentUser.profile.user_local_uid
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

    for (const person of currentUser.profile.user_members_delegate) {
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
  }, [currentUser, personsActive, fullnameOption]);

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
