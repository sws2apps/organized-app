import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { LanguageGroupMembersProps, PersonOption } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';

const useLanguageGroupMembers = ({
  group,
  onChange,
}: LanguageGroupMembersProps) => {
  const { personIsElder, personIsMS } = usePerson();

  const fullnameOption = useAtomValue(fullnameOptionState);
  const persons = useAtomValue(personsActiveState);
  const groups = useAtomValue(fieldGroupsState);

  const group_overseers = useMemo(() => {
    return group.group_data.members
      .filter((member) => member.isOverseer || member.isAssistant)
      .sort((a, b) => a.sort_index - b.sort_index)
      .map((record) => record.person_uid);
  }, [group]);

  const group_members = useMemo(() => {
    return group.group_data.members
      .filter((member) => !member.isOverseer && !member.isAssistant)
      .sort((a, b) => a.sort_index - b.sort_index)
      .map((record) => record.person_uid);
  }, [group]);

  const membersInGroups = useMemo(() => {
    const set = new Set<string>();

    groups.forEach((g) =>
      g.group_data.members.forEach((m) => set.add(m.person_uid))
    );

    return set;
  }, [groups]);

  const membersAll: PersonOption[] = useMemo(() => {
    return persons
      .filter((record) => !membersInGroups.has(record.person_uid))
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
      if (group_members.includes(record.person_uid)) return false;

      const person = persons.find((p) => p.person_uid === record.person_uid);

      if (!person) return false;

      return personIsElder(person) || personIsMS(person);
    });

    return records;
  }, [membersAll, persons, personIsElder, personIsMS, group_members]);

  const overseersSelected = useMemo(() => {
    if (overseersOptions.length === 0) return [];

    return group_overseers
      .map((record) => {
        return overseersOptions.find((person) => person.person_uid === record);
      })
      .filter(Boolean);
  }, [group_overseers, overseersOptions]);

  const memberOptions = useMemo(() => {
    return membersAll.filter(
      (record) =>
        !group_overseers.some((person) => person === record.person_uid)
    );
  }, [membersAll, group_overseers]);

  const membersSelected = useMemo(() => {
    if (memberOptions.length === 0) return [];

    return group_members
      .map((record) => {
        return memberOptions.find((person) => person.person_uid === record);
      })
      .filter(Boolean);
  }, [group_members, memberOptions]);

  const handleOverseersChange = (values: string[]) => {
    const newGroup = structuredClone(group);

    const overseer = values.at(0);
    const assistant = values.at(1);

    newGroup.group_data.members = newGroup.group_data.members.filter(
      (record) => !record.isOverseer && !record.isAssistant
    );

    if (overseer) {
      newGroup.group_data.members.push({
        isAssistant: false,
        isOverseer: true,
        person_uid: overseer,
        sort_index: 0,
      });
    }

    if (assistant) {
      newGroup.group_data.members.push({
        isAssistant: true,
        isOverseer: false,
        person_uid: assistant,
        sort_index: 1,
      });
    }

    // Reassign sort indexes to maintain consistency
    let currentIndex = 2;
    newGroup.group_data.members.sort((a, b) => a.sort_index - b.sort_index);

    newGroup.group_data.members.forEach((member) => {
      if (member.isOverseer) {
        member.sort_index = 0;
      } else if (member.isAssistant) {
        member.sort_index = 1;
      } else {
        member.sort_index = currentIndex++;
      }
    });

    onChange(newGroup);
  };

  const handleOverseerDelete = (value: string) => {
    const values = group_overseers.filter((record) => record !== value);
    handleOverseersChange(values);
  };

  const handleMembersChange = (values: string[]) => {
    const newGroup = structuredClone(group);

    newGroup.group_data.members = newGroup.group_data.members.filter(
      (member) => member.isOverseer || member.isAssistant
    );

    const addMembers = values.map((member, index) => {
      return {
        isOverseer: false,
        isAssistant: false,
        person_uid: member,
        sort_index: 2 + index,
      };
    });

    newGroup.group_data.members.push(...addMembers);

    onChange(newGroup);
  };

  const handleMembersDelete = (value: string) => {
    const values = group_members.filter((record) => record !== value);
    handleMembersChange(values);
  };

  return {
    overseersSelected,
    overseersOptions,
    memberOptions,
    membersSelected,
    handleOverseerDelete,
    handleMembersDelete,
    handleOverseersChange,
    handleMembersChange,
  };
};

export default useLanguageGroupMembers;
