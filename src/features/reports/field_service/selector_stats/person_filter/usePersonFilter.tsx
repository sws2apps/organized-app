import { useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  personFilterFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { FilterType } from './index.types';
import { PersonFilterOption } from '@definition/cong_field_service_reports';
import { fieldGroupsState } from '@states/field_service_groups';

const usePersonFilter = () => {
  const { t } = useAppTranslation();

  const [filter, setFilter] = useRecoilState(
    personFilterFieldServiceReportState
  );

  const setSelectedPublisher = useSetRecoilState(selectedPublisherReportState);

  const groups = useRecoilValue(fieldGroupsState);

  const filters = useMemo(() => {
    const result: FilterType[] = [];

    result.push(
      {
        key: 'publishers',
        options: [
          { key: 'active', name: t('tr_activePublishers') },
          { key: 'inactive', name: t('tr_inactivePublishers') },
          { key: 'unbaptized', name: t('tr_unbaptizedPublishers') },
          { key: 'baptized', name: t('tr_baptizedPublishers') },
          { key: 'not_submitted', name: t('tr_reportNotSubmitted') },
          { key: 'appointed', name: t('tr_appointedBrothers') },
        ],
      },
      {
        key: 'pioneers',
        options: [
          { key: 'AP', name: t('tr_APs') },
          { key: 'FR', name: t('tr_FRs') },
        ],
      }
    );

    const validGroups = groups.filter(
      (record) => record.group_data.members.length > 0
    );

    if (validGroups.length > 0) {
      const groupOptions = validGroups.map((group) => {
        let group_name = String(group.group_data.sort_index + 1);

        if (group.group_data.name.length > 0) {
          group_name += ` — ${group.group_data.name}`;
        }

        return {
          key: `group-${group.group_data.sort_index + 1}`,
          name: t('tr_groupName', { groupName: group_name }),
        };
      });

      result.push({ key: 'groups', options: groupOptions });
    }

    return result;
  }, [t, groups]);

  const show_group = useMemo(() => {
    return filters.some((record) => record.key === 'groups');
  }, [filters]);

  const handleChangeFilter = (value: PersonFilterOption) => {
    setSelectedPublisher(undefined);

    setFilter(value);
  };

  return { filters, handleChangeFilter, filter, show_group };
};

export default usePersonFilter;
