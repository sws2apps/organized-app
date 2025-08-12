import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { personsActiveState } from '@states/persons';
import { UsersOption } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { refreshReadOnlyRoles } from '@services/app/persons';
import useUserDetails from '../useUserDetails';

const useProfileSettings = () => {
  const { handleSaveDetails, currentUser } = useUserDetails();

  const personsActive = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [delegatedPersons, setDelegatedPersons] = useState<UsersOption[]>([]);

  const available_persons = useMemo(() => {
    if (!currentUser) return [];

    return personsActive;
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
    return personsActive
      .filter(
        (record) => record.person_uid !== currentUser.profile.user_local_uid
      )
      .map((person) => {
        return {
          person_uid: person.person_uid,
          person_name: buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value,
            fullnameOption
          ),
        };
      });
  }, [personsActive, currentUser, fullnameOption]);

  const handleSelectPerson = async (value: UsersOption) => {
    try {
      setSelectedPerson(value);

      const newUser = structuredClone(currentUser);
      newUser.profile.user_local_uid = value.person_uid;

      const userRole = newUser.profile?.cong_role || [];

      const person = personsActive.find(
        (record) => record.person_uid === value.person_uid
      );

      newUser.profile.cong_role = refreshReadOnlyRoles(person, userRole);

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

      displaySnackNotification({
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

      displaySnackNotification({
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

      displaySnackNotification({
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
