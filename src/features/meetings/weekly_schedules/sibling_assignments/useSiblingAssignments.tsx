import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import { SiblingOption } from './index.types';

const useSiblingAssignments = () => {
  const { t } = useAppTranslation();

  const currentDataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const views = useMemo(() => {
    const result: SiblingOption[] = [];

    if (currentDataView !== 'main') {
      result.push({ type: 'main', label: t('tr_hostCongregation') });
    }

    const groups = languageGroups.filter(
      (record) => record.group_id !== currentDataView
    );

    for (const group of groups) {
      result.push({
        type: group.group_id,
        label: group.group_data.name,
      });
    }

    return result;
  }, [currentDataView, languageGroups, t]);

  return { views };
};

export default useSiblingAssignments;
