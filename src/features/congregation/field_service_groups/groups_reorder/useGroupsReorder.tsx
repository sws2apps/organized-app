import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { fieldGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { dbFieldServiceGroupBulkSave } from '@services/dexie/field_service_groups';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { GroupType, GroupsReorderProps } from './index.types';

const useGroupsReorder = ({ onClose }: GroupsReorderProps) => {
  const groupsList = useRecoilValue(fieldGroupsState);

  const groups_initial = groupsList.map((record, index) => {
    let name = String(index + 1);

    if (record.group_data.name.length > 0) {
      name += ` — ${record.group_data.name}`;
    }

    return { id: record.group_id, name };
  });

  const [groups, setGroups] = useState<GroupType[]>(groups_initial);

  const groups_sorted = useMemo(() => {
    const result: FieldServiceGroupType[] = [];

    for (const group of groupsList) {
      const newGroup = structuredClone(group);

      const findIndex = groups.findIndex(
        (record) => record.id === newGroup.group_id
      );

      newGroup.group_data.sort_index = findIndex;
      newGroup.group_data.updatedAt = new Date().toISOString();

      result.push(newGroup);
    }

    return result;
  }, [groups, groupsList]);

  const handleDragChange = (value: GroupType[]) => {
    setGroups(value);
  };

  const handleSaveChanges = async () => {
    try {
      await dbFieldServiceGroupBulkSave(groups_sorted);

      onClose?.();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { groups, handleDragChange, handleSaveChanges };
};

export default useGroupsReorder;
