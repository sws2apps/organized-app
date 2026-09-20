import { MouseEvent, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { PublisherItemProps } from './index.types';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';

const usePublisherItem = ({ publisher }: PublisherItemProps) => {
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const groups_list = useMemo(() => {
    return groups.filter((record) => !record.group_data.language_group);
  }, [groups]);

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleAssign = async (group_id: string) => {
    setAnchorEl(null);

    const group = structuredClone(
      groups_list.find((record) => record.group_id === group_id)
    );

    if (!group) return;

    const publishers = group.group_data.members.filter(
      (member) => !member.isOverseer && !member.isAssistant
    );

    group.group_data.members.push({
      person_uid: publisher.person_uid,
      isOverseer: false,
      isAssistant: false,
      sort_index: publishers.length,
    });

    group.group_data.updatedAt = new Date().toISOString();

    await dbFieldServiceGroupSave(group);
  };

  return {
    anchorEl,
    open,
    groups_list,
    handleOpenMenu,
    handleCloseMenu,
    handleAssign,
  };
};

export default usePublisherItem;
