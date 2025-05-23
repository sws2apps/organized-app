import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  languageGroupsState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import MidweekSettings from './midweek';
import WeekendSettings from './weekend';

export default function useMeetingSettings() {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);
  const settings = useAtomValue(settingsState);

  const [hasMidweek, setHasMidweek] = useState(false);
  const [hasWeekend, setHasWeekend] = useState(false);
  const [value, setValue] = useState<boolean | number>(false);

  const group = useMemo(() => {
    return languageGroups.find((record) => record.id === dataView);
  }, [dataView, languageGroups]);

  const tabs = useMemo(() => {
    const result: { label: ReactNode; Component: ReactNode }[] = [];

    if (!isGroup || (isGroup && hasMidweek)) {
      result.push({
        label: t('tr_midweek'),
        Component: <MidweekSettings />,
      });
    }

    if (!isGroup || (isGroup && hasWeekend)) {
      result.push({
        label: t('tr_weekend'),
        Component: <WeekendSettings />,
      });
    }

    return result;
  }, [isGroup, hasMidweek, hasWeekend, t]);

  const handleTabChange = (tab: number) => setValue(tab);

  const handleToggleMidweek = async (checked: boolean) => {
    try {
      if (!checked && hasWeekend) {
        setValue(0);
      }

      const groups = structuredClone(
        settings.cong_settings.language_groups.groups
      );

      const findGroup = groups.find((record) => record.id === dataView);

      if (findGroup) {
        findGroup.midweek_meeting = checked;
        findGroup.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  const handleToggleWeekend = async (checked: boolean) => {
    try {
      if (!checked && hasMidweek) {
        setValue(0);
      }

      const groups = structuredClone(
        settings.cong_settings.language_groups.groups
      );

      const findGroup = groups.find((record) => record.id === dataView);

      if (findGroup) {
        findGroup.weekend_meeting = checked;
        findGroup.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    if (!group) return;

    setHasMidweek(group.midweek_meeting);
    setHasWeekend(group.weekend_meeting);
  }, [group]);

  return {
    hasMidweek,
    hasWeekend,
    handleToggleMidweek,
    handleToggleWeekend,
    tabs,
    value,
    handleTabChange,
  };
}
