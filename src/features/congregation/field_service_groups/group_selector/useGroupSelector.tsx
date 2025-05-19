import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

const useGroupSelector = (includeLanguageGroup: boolean) => {
  const { t } = useAppTranslation();

  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const options = useMemo(() => {
    return groups
      .filter((record) => {
        if (!record.editable && !includeLanguageGroup) return false;

        return true;
      })
      .map((record) => {
        let groupName = record.group.group_data?.name ?? '';

        if (groupName.length === 0) {
          const groupIndex = String(record.group.group_data.sort_index + 1);
          groupName = t('tr_groupNumber', { groupNumber: groupIndex });
        }

        return {
          value: record.group.group_id,
          label: groupName,
          field_group: record.editable,
        };
      });
  }, [groups, t, includeLanguageGroup]);

  return { options };
};

export default useGroupSelector;
