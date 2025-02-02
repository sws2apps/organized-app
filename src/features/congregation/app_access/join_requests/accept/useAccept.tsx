import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AppRoleType } from '@definition/app';
import { AcceptRequestProps, UsersOption } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { congregationUsersState } from '@states/app';

const useAcceptRequest = ({ onConfirm }: AcceptRequestProps) => {
  const persons = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const users = useRecoilValue(congregationUsersState);

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

    setOpen(false);
    onConfirm?.(selectedPerson.person_uid, roles);

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
