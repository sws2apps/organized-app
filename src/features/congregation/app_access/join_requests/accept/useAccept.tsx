import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { AppRoleType } from '@definition/app';
import { AcceptRequestProps, UsersOption } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { congregationUsersState } from '@states/app';
import usePerson from '@features/persons/hooks/usePerson';

const useAcceptRequest = ({ onConfirm }: AcceptRequestProps) => {
  const {
    personIsBaptizedPublisher,
    personIsMidweekStudent,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
  } = usePerson();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const users = useAtomValue(congregationUsersState);

  const [open, setOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<UsersOption>(null);
  const [roles, setRoles] = useState<AppRoleType[]>([]);

  const available_persons = useMemo(() => {
    return persons.filter(
      (record) =>
        record.person_data.male.value &&
        record.person_data.publisher_baptized.active.value &&
        users.some(
          (user) => user.profile.user_local_uid === record.person_uid
        ) === false
    );
  }, [persons, users]);

  const options: UsersOption[] = useMemo(() => {
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

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedPerson(null);
    setRoles([]);
  };

  const handleRolesChange = (role: AppRoleType, checked: boolean) => {
    if (checked) {
      setRoles((prev) => {
        const data = structuredClone(prev);
        data.push(role);

        return Array.from(new Set(data));
      });
    }

    if (!checked) {
      setRoles((prev) => {
        const data = prev.filter((record) => record !== role);
        return data;
      });
    }
  };

  const handleConfirm = () => {
    if (!selectedPerson) return;

    let userRole = structuredClone(roles);

    const person = persons.find(
      (record) => record.person_uid === selectedPerson.person_uid
    );

    const isMidweekStudent = personIsMidweekStudent(person);

    const isPublisher =
      personIsBaptizedPublisher(person) || personIsUnbaptizedPublisher(person);

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

    userRole = Array.from(new Set(userRole));

    setOpen(false);
    onConfirm?.(selectedPerson.person_uid, userRole);

    setSelectedPerson(null);
    setRoles([]);
  };

  return {
    open,
    handleOpen,
    handleClose,
    handleConfirm,
    options,
    selectedPerson,
    setSelectedPerson,
    roles,
    handleRolesChange,
  };
};

export default useAcceptRequest;
