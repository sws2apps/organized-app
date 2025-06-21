import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  personFilterFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { FilterType } from './index.types';
import { PersonFilterOption } from '@definition/cong_field_service_reports';
import {
  fieldGroupsState,
  languageGroupsState,
} from '@states/field_service_groups';
import { FieldServiceGroupType } from '@definition/field_service_groups';

const usePersonFilter = () => {
  const { t } = useAppTranslation();

  const {
    isGroupOverseer,
    isSecretary,
    my_group,
    isGroup,
    isLanguageGroupOverseer,
    languageGroup,
  } = useCurrentUser();

  const [filter, setFilter] = useAtom(personFilterFieldServiceReportState);

  const setSelectedPublisher = useSetAtom(selectedPublisherReportState);

  const groups = useAtomValue(fieldGroupsState);
  const languageGroups = useAtomValue(languageGroupsState);

  const filters = useMemo(() => {
    const result: FilterType[] = [];

    if (isSecretary && !isGroup) {
      result.push(
        {
          key: 'publishers',
          options: [
            { key: 'active', name: t('tr_activePublishers') },
            { key: 'inactive', name: t('tr_inactivePublishers') },
            { key: 'unbaptized', name: t('tr_unbaptizedPublishers') },
            { key: 'baptized', name: t('tr_baptizedPublishers') },
            { key: 'not_submitted', name: t('tr_reportNotSubmitted') },
            { key: 'unverified', name: t('tr_reportUnverified') },
            { key: 'verified', name: t('tr_reportVerified') },
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
    }

    let validGroups: FieldServiceGroupType[] = [];

    let allGroups = groups.filter(
      (record) => record.group_data.members.length > 0
    );

    if (isSecretary) {
      validGroups.push(...allGroups);
    }

    if (!isSecretary && isGroupOverseer) {
      const valid = allGroups.find(
        (record) => record.group_id === my_group.group_id
      );

      if (valid) {
        validGroups.push(my_group);
      }
    }

    if (validGroups.length > 0) {
      const groupOptions = validGroups.map((group) => {
        let group_name = String(group.group_data.sort_index + 1);

        if (group.group_data.name?.length > 0) {
          group_name += ` — ${group.group_data.name}`;
        }

        return {
          key: `group-${group.group_data.sort_index + 1}`,
          name: t('tr_groupName', { groupName: group_name }),
        };
      });

      result.push({ key: 'groups', options: groupOptions });
    }

    validGroups = [];

    allGroups = languageGroups.filter(
      (record) => record.group_data.members.length > 0
    );

    if (isSecretary) {
      validGroups.push(...allGroups);
    }

    if (!isSecretary && isLanguageGroupOverseer) {
      const valid = allGroups.find(
        (record) => record.group_id === languageGroup.group_id
      );

      if (valid) {
        validGroups.push(languageGroup);
      }
    }

    if (validGroups.length > 0) {
      const groupOptions = validGroups.map((group) => {
        return {
          key: `language-group-${group.group_id}`,
          name: group.group_data.name,
        };
      });

      result.push({ key: 'language_groups', options: groupOptions });
    }

    return result;
  }, [
    t,
    groups,
    isSecretary,
    isGroupOverseer,
    my_group,
    languageGroups,
    isGroup,
    isLanguageGroupOverseer,
    languageGroup,
  ]);

  const show_group = useMemo(() => {
    if (isGroup) return false;

    return filters.some((record) => record.key === 'groups');
  }, [filters, isGroup]);

  const show_language_group = useMemo(() => {
    return filters.some((record) => record.key === 'language_groups');
  }, [filters]);

  const handleChangeFilter = (value: PersonFilterOption) => {
    setSelectedPublisher(undefined);

    setFilter(value);
  };

  useEffect(() => {
    if (!isSecretary && isGroupOverseer) {
      setFilter('');

      const groups = filters.find((record) => record.key === 'groups');

      if (groups) {
        const option = groups.options.at(0);

        if (option) {
          setFilter(option.key);
        }
      }
    }

    if (isGroup) {
      setFilter('');

      const groups = filters.find((record) => record.key === 'language_groups');

      if (groups) {
        const option = groups.options.at(0);

        if (option) {
          setFilter(option.key);
        }
      }
    }
  }, [filters, isGroupOverseer, isSecretary, setFilter, isGroup]);

  return {
    filters,
    handleChangeFilter,
    filter,
    show_group,
    show_language_group,
  };
};

export default usePersonFilter;
