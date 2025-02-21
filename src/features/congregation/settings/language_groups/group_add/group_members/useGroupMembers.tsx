import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congregationsAppAdminState } from '@states/app';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { personsActiveState } from '@states/persons';
import { GroupMembersProps, PersonOption } from './index.types';

const useGroupMembers = ({
  group,
  onChange,
  members,
  onChangeMembers,
}: GroupMembersProps) => {
  const congregationAdmins = useRecoilValue(congregationsAppAdminState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const persons = useRecoilValue(personsActiveState);

  const membersAll: PersonOption[] = useMemo(() => {
    return persons.map((record) => {
      return {
        person_uid: record.person_uid,
        person_name: buildPersonFullname(
          record.person_data.person_lastname.value,
          record.person_data.person_firstname.value,
          fullnameOption
        ),
      };
    });
  }, [persons, fullnameOption]);

  const adminOptions: PersonOption[] = useMemo(() => {
    if (!congregationAdmins) return [];

    const records = congregationAdmins.filter((record) =>
      membersAll.some(
        (person) => person.person_uid === record.profile.user_local_uid
      )
    );

    return records.map((record) => {
      return {
        person_uid: record.profile.user_local_uid,
        person_name: buildPersonFullname(
          record.profile.lastname.value,
          record.profile.firstname.value,
          fullnameOption
        ),
      };
    });
  }, [congregationAdmins, fullnameOption]);

  const [admins, setAdmins] = useState(() => {
    return group.admins.map((record) => {
      return adminOptions.find((person) => person.person_uid === record);
    });
  });

  const memberOptions = useMemo(() => {
    return membersAll.filter(
      (record) =>
        admins.some((person) => person.person_uid === record.person_uid) ===
        false
    );
  }, [membersAll, admins]);

  const [groupMembers, setGroupMembers] = useState(() => {
    return members.map((record) => {
      return memberOptions.find((person) => person.person_uid === record);
    });
  });

  const handleAdminChange = (values: PersonOption[]) => {
    setAdmins(values);

    const newGroup = structuredClone(group);
    newGroup.admins = values.map((record) => record.person_uid);
    onChange(newGroup);
  };

  const handleAdminDelete = (value: PersonOption) => {
    setAdmins((prev) => {
      const newValues = prev.filter(
        (record) => record.person_uid !== value.person_uid
      );
      return newValues;
    });

    const newGroup = structuredClone(group);
    newGroup.admins = newGroup.admins.filter(
      (record) => record !== value.person_uid
    );
    onChange(newGroup);
  };

  const handleMembersChange = (values: PersonOption[]) => {
    setGroupMembers(values);
    onChangeMembers(values.map((record) => record.person_uid));
  };

  const handleMembersDelete = (value: PersonOption) => {
    onChangeMembers(
      groupMembers
        .filter((record) => record.person_uid !== value.person_uid)
        .map((record) => record.person_uid)
    );

    setGroupMembers((prev) => {
      const newValues = prev.filter(
        (record) => record.person_uid !== value.person_uid
      );
      return newValues;
    });
  };

  return {
    adminOptions,
    handleAdminChange,
    handleAdminDelete,
    admins,
    memberOptions,
    groupMembers,
    handleMembersChange,
    handleMembersDelete,
  };
};

export default useGroupMembers;
