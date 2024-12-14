import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { GroupMembersProps, MemberType, UsersOption } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupMemberType } from '@definition/field_service_groups';
import { buildPersonFullname } from '@utils/common';

const useGroupMembers = ({ group, onChange }: GroupMembersProps) => {
  const persons = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const groups = useRecoilValue(fieldGroupsState);

  const [members, setMembers] = useState<MemberType[]>([]);
  const [inputValue, setInputValue] = useState('');

  const other_groups_members = useMemo(() => {
    const otherGroups = groups.filter(
      (record) => record.group_id !== group?.group_id
    );

    const assigned = otherGroups.reduce(
      (acc: FieldServiceGroupMemberType[], current) => {
        acc.push(...current.group_data.members);
        return acc;
      },
      []
    );

    return assigned;
  }, [groups, group]);

  const groups_members = useMemo(() => {
    return group.group_data.members
      .filter((record) => !record.isOverseer && !record.isAssistant)
      .sort((a, b) => a.sort_index - b.sort_index);
  }, [group]);

  const overseers = useMemo(() => {
    return group.group_data.members.filter(
      (record) => record.isOverseer || record.isAssistant
    );
  }, [group]);

  const publishers_unassigned = useMemo(() => {
    const assigned = [...other_groups_members, ...groups_members, ...overseers];

    const result = persons.filter(
      (person) =>
        assigned.some((record) => record.person_uid === person.person_uid) ===
        false
    );

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
  }, [
    fullnameOption,
    other_groups_members,
    groups_members,
    persons,
    overseers,
  ]);

  const getIndex = () => {
    const lastMember = group.group_data.members.findLast(
      (record) => !record.isOverseer && !record.isAssistant
    );

    if (!lastMember) return 2;

    const lastIndex = lastMember.sort_index + 1;
    return lastIndex;
  };

  const handleInputChange = (value: string) => setInputValue(value);

  const handleAddPublisher = (value: UsersOption) => {
    setInputValue('');

    const newGroup = structuredClone(group);
    const index = getIndex();

    newGroup.group_data.members.push({
      isAssistant: false,
      isOverseer: false,
      person_uid: value.person_uid,
      sort_index: index,
    });

    newGroup.group_data.updatedAt = new Date().toISOString();

    onChange(newGroup);
  };

  const handleDragChange = (value: MemberType[]) => {
    setMembers(value);

    const newGroup = structuredClone(group);
    const members = newGroup.group_data.members;

    for (const member of members) {
      if (member.sort_index < 2) continue;

      const findIndex = value.findIndex(
        (record) => record.id === member.person_uid
      );

      if (findIndex > -1) {
        member.sort_index = 2 + findIndex;
      }

      if (findIndex === -1) {
        member.sort_index = undefined;
      }
    }

    const findLast = members.findLast(
      (record) => !record.isOverseer && !record.isAssistant && record.sort_index
    );
    const index = findLast.sort_index;

    let startIndex = index + 1;

    for (const member of members) {
      if (member.sort_index === undefined) {
        member.sort_index = startIndex;
      }

      startIndex++;
    }

    newGroup.group_data.updatedAt = new Date().toISOString();

    onChange(newGroup);
  };

  const handleRemove = (id: string) => {
    const newGroup = structuredClone(group);
    const findIndex = newGroup.group_data.members.find(
      (record) => record.person_uid === id
    ).sort_index;

    newGroup.group_data.members = newGroup.group_data.members.filter(
      (record) => record.person_uid !== id
    );

    for (const member of newGroup.group_data.members) {
      if (member.sort_index < findIndex) continue;

      member.sort_index = member.sort_index - 1;
    }

    newGroup.group_data.updatedAt = new Date().toISOString();

    onChange(newGroup);
  };

  useEffect(() => {
    setMembers(
      groups_members.map((record) => {
        return { id: record.person_uid };
      })
    );
  }, [groups_members]);

  return {
    publishers_unassigned,
    handleAddPublisher,
    members,
    handleDragChange,
    handleRemove,
    handleInputChange,
    inputValue,
  };
};

export default useGroupMembers;
