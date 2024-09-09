import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { GroupDeleteProps } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useGroupDelete = ({ group_id, onClose }: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const groups = useRecoilValue(fieldGroupsState);

  const group = useMemo(() => {
    return groups.find((record) => record.group_id === group_id);
  }, [groups, group_id]);

  const handleDeleteGroup = async () => {
    try {
      const groupDelete = structuredClone(group);
      groupDelete.group_data._deleted = true;
      groupDelete.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(groupDelete);

      onClose?.();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleDeleteGroup };
};

export default useGroupDelete;
