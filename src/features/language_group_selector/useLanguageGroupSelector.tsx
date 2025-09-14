import { useEffect, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  dbAppSettingsSetupMeetingDuties,
  dbAppSettingsUpdate,
} from '@services/dexie/settings';
import {
  congNameState,
  languageGroupEnabledState,
  userDataViewState,
} from '@states/settings';
import { Option } from './index.types';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';
import { languageGroupsState } from '@states/field_service_groups';
import { refreshLocalesResources } from '@services/i18n';

const useGroupLanguageSelector = () => {
  const { t } = useAppTranslation();

  const { person } = useCurrentUser();

  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const languageGroupEnabled = useAtomValue(languageGroupEnabledState);
  const languageGroups = useAtomValue(languageGroupsState);
  const congName = useAtomValue(congNameState);
  const value = useAtomValue(userDataViewState);

  const display = useMemo(() => {
    if (!person) return false;

    if (!languageGroupEnabled) return false;

    const foundInGroups = languageGroups.some((group) =>
      group.group_data.members.some(
        (member) => member.person_uid === person.person_uid
      )
    );

    if (!foundInGroups) return false;

    return languageGroups.length > 0;
  }, [languageGroups, languageGroupEnabled, person]);

  const options = useMemo(() => {
    if (!display) return [];

    const result: Option[] = [{ icon: 'main', value: 'main', label: congName }];

    for (const group of languageGroups) {
      result.push({
        icon: 'group',
        value: group.group_id,
        label: group.group_data.name,
      });
    }

    return result.sort((a, b) => a.label.localeCompare(b.label));
  }, [display, congName, languageGroups]);

  const renderValue = (value: string) => {
    if (value === 'main') return t('tr_hostCongregation');

    return options.find((record) => record.value === value).label;
  };

  const handleChange = async (value: string) => {
    await dbAppSettingsUpdate({
      'user_settings.data_view': { value, updatedAt: new Date().toISOString() },
    });

    await refreshLocalesResources();

    await dbAppSettingsSetupMeetingDuties();

    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  useEffect(() => {
    const validateDataView = async () => {
      if (value === 'main') return;

      const findGroup = languageGroups.find(
        (record) => record.group_id === value
      );

      if (findGroup) return;

      await dbAppSettingsUpdate({
        'user_settings.data_view': {
          value: 'main',
          updatedAt: new Date().toISOString(),
        },
      });
    };

    validateDataView();
  }, [value, languageGroups]);

  return { display, options, value, renderValue, handleChange };
};

export default useGroupLanguageSelector;
