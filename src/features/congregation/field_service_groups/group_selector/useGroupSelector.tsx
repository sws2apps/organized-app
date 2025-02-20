import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';

const useGroupSelector = () => {
  const { t } = useAppTranslation();

  const groups = useRecoilValue(fieldGroupsState);

  const [isHovered, setIsHovered] = useState(false);

  const options = useMemo(() => {
    return groups.map((group) => {
      let groupName = String(group.group_data.sort_index + 1);

      if (group.group_data.name.length > 0) {
        groupName += ` (${group.group_data.name})`;
      }

      return { value: group.group_id, label: t('tr_groupName', { groupName }) };
    });
  }, [groups, t]);

  const renderValue = (value: string) => {
    const find = options.find((record) => record.value === value);

    if (!find) return '';

    return find.label;
  };

  return { options, renderValue, isHovered, setIsHovered };
};

export default useGroupSelector;
