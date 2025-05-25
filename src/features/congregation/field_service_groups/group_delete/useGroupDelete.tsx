import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { GroupDeleteProps } from './index.types';
import {
  fieldGroupsState,
  fieldWithLanguageGroupsState,
} from '@states/field_service_groups';
import { dbFieldServiceGroupBulkSave } from '@services/dexie/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useGroupDelete = ({ group_id, onClose }: GroupDeleteProps) => {
  const groups = useAtomValue(fieldGroupsState);
  const allGroups = useAtomValue(fieldWithLanguageGroupsState);

  const group = useMemo(() => {
    return groups.find((record) => record.group_id === group_id);
  }, [groups, group_id]);

  const handleDeleteGroup = async () => {
    try {
      const groupDelete = structuredClone(group);
      groupDelete.group_data._deleted = true;
      groupDelete.group_data.updatedAt = new Date().toISOString();

      const validGroups = allGroups.filter(
        (group) => group.group_id !== groupDelete.group_id
      );

      const groupsSave = validGroups.map((group, index) => {
        group.group_data.sort_index = index;
        group.group_data.updatedAt = new Date().toISOString();
        return group;
      });

      groupsSave.push(groupDelete);

      await dbFieldServiceGroupBulkSave(groupsSave);

      onClose?.();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleDeleteGroup };
};

export default useGroupDelete;
