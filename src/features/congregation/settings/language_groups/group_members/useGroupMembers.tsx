import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { congregationsAppAdminState } from '@states/app';
import { fullnameOptionState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { LanguageGroupMembersProps, PersonOption } from './index.types';

const useLanguageGroupMembers = ({
  admins,
  members,
}: LanguageGroupMembersProps) => {
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

    const records = congregationAdmins.filter(
      (record) =>
        membersAll.some(
          (person) => person.person_uid === record.profile.user_local_uid
        ) && members.some((m) => m === record.profile.user_local_uid) === false
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
  }, [congregationAdmins, fullnameOption, membersAll, members]);

  const adminsSelected = useMemo(() => {
    if (adminOptions.length === 0) return [];

    return admins.map((record) => {
      return adminOptions.find((person) => person.person_uid === record);
    });
  }, [admins, adminOptions]);

  const memberOptions = useMemo(() => {
    return membersAll.filter(
      (record) =>
        admins.some((person) => person === record.person_uid) === false
    );
  }, [membersAll, admins]);

  const membersSelected = useMemo(() => {
    if (memberOptions.length === 0) return [];

    return members.map((record) => {
      return memberOptions.find((person) => person.person_uid === record);
    });
  }, [members, memberOptions]);

  return { adminsSelected, adminOptions, memberOptions, membersSelected };
};

export default useLanguageGroupMembers;
