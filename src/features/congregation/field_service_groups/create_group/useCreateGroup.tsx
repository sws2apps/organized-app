import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { CreateGroupProps, CreateState } from './index.types';
import { SchemaFieldServiceGroup } from '@services/dexie/schema';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import {
  fieldGroupsState,
  languageGroupsState,
} from '@states/field_service_groups';
import {
  dbFieldServiceGroupBulkSave,
  dbFieldServiceGroupSave,
} from '@services/dexie/field_service_groups';

const useCreateGroup = ({ onClose }: CreateGroupProps) => {
  const { t } = useAppTranslation();

  const groups = useAtomValue(fieldGroupsState);
  const languageGroups = useAtomValue(languageGroupsState);

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

      // update sort index of language groups
      const langGroups = languageGroups.map((group, index) => {
        group.group_data.sort_index = groups.length + 1 + index;

        return group;
      });

      await dbFieldServiceGroupBulkSave(langGroups);

      displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_newServiceGroupCreatedSuccess'),
        severity: 'success',
      });

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
