import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

const useGroupSelector = (
  showServiceGroups: boolean,
  includeLanguageGroup: boolean
) => {
  const { t } = useAppTranslation();

  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const options = useMemo(() => {
    return groups
      .filter((record) => {
        if (record.group_data.language_group && !includeLanguageGroup)
          return false;

        if (!record.group_data.language_group && !showServiceGroups)
          return false;

        return true;
      })
      .map((record) => {
        let groupName = record.group_data?.name ?? '';

        if (groupName.length === 0) {
          const groupIndex = String(record.group_data.sort_index + 1);
          groupName = t('tr_groupNumber', { groupNumber: groupIndex });
        }

        return {
          value: record.group_id,
          label: groupName,
          field_group: !!record.group_data.language_group,
        };
      });
  }, [groups, t, includeLanguageGroup, showServiceGroups]);

  return { options };
};

export default useGroupSelector;
