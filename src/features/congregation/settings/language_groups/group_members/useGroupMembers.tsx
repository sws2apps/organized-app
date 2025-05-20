import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { LanguageGroupMembersProps, PersonOption } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';

const useLanguageGroupMembers = ({
  overseers,
  members,
}: LanguageGroupMembersProps) => {
  const { personIsElder, personIsMS } = usePerson();

  const fullnameOption = useAtomValue(fullnameOptionState);
  const persons = useAtomValue(personsActiveState);
  const groups = useAtomValue(fieldGroupsState);

  const membersInGroups = useMemo(() => {
    const set = new Set<string>();

    groups.forEach((g) =>
      g.group_data.members.forEach((m) => set.add(m.person_uid))
    );

    return set;
  }, [groups]);

  const membersAll: PersonOption[] = useMemo(() => {
    return persons
      .filter(
        (record) =>
          (record.person_data.publisher_unbaptized.active.value ||
            record.person_data.publisher_baptized.active.value) &&
          !membersInGroups.has(record.person_uid)
      )
      .map((record) => {
        return {
          person_uid: record.person_uid,
          person_name: buildPersonFullname(
            record.person_data.person_lastname.value,
            record.person_data.person_firstname.value,
            fullnameOption
          ),
        };
      });
  }, [persons, fullnameOption, membersInGroups]);

  const overseersOptions: PersonOption[] = useMemo(() => {
    const records = membersAll.filter((record) => {
      if (members.includes(record.person_uid)) return false;

      const person = persons.find((p) => p.person_uid === record.person_uid);

      if (!person) return false;

      return personIsElder(person) || personIsMS(person);
    });

    return records;
  }, [membersAll, persons, personIsElder, personIsMS, members]);

  const overseersSelected = useMemo(() => {
    if (overseersOptions.length === 0) return [];

    return overseers
      .map((record) => {
        return overseersOptions.find((person) => person.person_uid === record);
      })
      .filter(Boolean);
  }, [overseers, overseersOptions]);

  const memberOptions = useMemo(() => {
    return membersAll.filter(
      (record) => !overseers.some((person) => person === record.person_uid)
    );
  }, [membersAll, overseers]);

  const membersSelected = useMemo(() => {
    if (memberOptions.length === 0) return [];

    return members
      .map((record) => {
        return memberOptions.find((person) => person.person_uid === record);
      })
      .filter(Boolean) as PersonOption[];
  }, [members, memberOptions]);

  return {
    overseersSelected,
    overseersOptions,
    memberOptions,
    membersSelected,
  };
};

export default useLanguageGroupMembers;
