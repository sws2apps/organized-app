import { useCallback, useMemo } from 'react';
import { GroupItemProps } from './index.types';
import { FieldServiceGroupMemberType } from '@definition/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import useCurrentUser from '@hooks/useCurrentUser';

const useGroupItem = ({ group, index, editable }: GroupItemProps) => {
  const { isServiceCommittee } = useCurrentUser();

  const border_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `1px solid rgba(var(${css}), 0.48)`;
  }, [index]);

  const divider_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.16)`;
  }, [index]);

  const members = useMemo(() => {
    return group.group_data.members.map((member) => ({
      ...member,
      id: member.person_uid,
    }));
  }, [group.group_data.members]);

  const accepts_members = useMemo(() => {
    return editable && isServiceCommittee;
  }, [editable, isServiceCommittee]);

  const handleMembersChange = useCallback(
    async (next: (FieldServiceGroupMemberType & { id: string })[]) => {
      const added = next.find(
        (record) =>
          !group.group_data.members.some(
            (member) => member.person_uid === record.person_uid
          )
      );

      if (!added) return;

      const newGroup = structuredClone(group);

      const publishers = newGroup.group_data.members.filter(
        (member) => !member.isOverseer && !member.isAssistant
      );

      newGroup.group_data.members.push({
        person_uid: added.person_uid,
        isOverseer: false,
        isAssistant: false,
        sort_index: publishers.length,
      });

      newGroup.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(newGroup);
    },
    [group]
  );

  return {
    border_color,
    divider_color,
    members,
    accepts_members,
    handleMembersChange,
  };
};

export default useGroupItem;
