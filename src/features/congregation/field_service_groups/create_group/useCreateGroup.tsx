import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { CreateGroupProps, CreateState } from './index.types';
import { SchemaFieldServiceGroup } from '@services/dexie/schema';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { fieldGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';

const useCreateGroup = ({ onClose }: CreateGroupProps) => {
  const { t } = useAppTranslation();

  const groups = useRecoilValue(fieldGroupsState);

  const newGroup = useMemo(() => {
    const data = structuredClone(SchemaFieldServiceGroup);
    data.group_id = crypto.randomUUID();
    data.group_data.sort_index = groups.length;

    return data;
  }, [groups]);

  const [state, setState] = useState<CreateState>('start');
  const [group, setGroup] = useState(newGroup);

  const handleNext = () => setState('final');

  const handleBack = () => setState('start');

  const handleGroupUpdate = (value: FieldServiceGroupType) => {
    setGroup(value);
  };

  const handleCreate = async () => {
    try {
      await dbFieldServiceGroupSave(group);

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_newServiceGroupCreatedSuccess'),
        severity: 'success',
      });

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

  return {
    state,
    handleNext,
    handleCreate,
    handleBack,
    group,
    handleGroupUpdate,
  };
};

export default useCreateGroup;
