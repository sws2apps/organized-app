import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import MidweekSettings from './midweek';
import WeekendSettings from './weekend';

export default function useMeetingSettings() {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const [hasMidweek, setHasMidweek] = useState(false);
  const [hasWeekend, setHasWeekend] = useState(false);
  const [value, setValue] = useState<boolean | number>(false);

  const group = useMemo(() => {
    return languageGroups.find((record) => record.group_id === dataView);
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

      const findGroup = structuredClone(group);
      findGroup.group_data.midweek_meeting = checked;
      findGroup.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(findGroup);
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

      const findGroup = structuredClone(group);

      findGroup.group_data.weekend_meeting = checked;
      findGroup.group_data.updatedAt = new Date().toISOString();

      await dbFieldServiceGroupSave(findGroup);
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

    setHasMidweek(group.group_data.midweek_meeting);
    setHasWeekend(group.group_data.weekend_meeting);
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
