import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';

const useGroupSelector = () => {
  const { t } = useAppTranslation();

  const groups = useAtomValue(fieldGroupsState);

  const options = useMemo(() => {
    return groups.map((group) => {
      let groupName = String(group.group_data.sort_index + 1);

      if (group.group_data.name?.length > 0) {
        groupName += ` (${group.group_data.name})`;
      }

      return { value: group.group_id, label: t('tr_groupName', { groupName }) };
    });
  }, [groups, t]);

  return { options };
};

export default useGroupSelector;
