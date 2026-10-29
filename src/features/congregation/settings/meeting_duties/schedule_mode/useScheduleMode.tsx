import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { SelectChangeEvent } from '@mui/material';
import {
  dutiesScheduleWeeklyState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dutiesSaveSettings } from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useScheduleMode = () => {
  const weekly = useAtomValue(dutiesScheduleWeeklyState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const [saving, setSaving] = useState(false);

  const handleChange = async (event: SelectChangeEvent<unknown>) => {
    if (saving) return;
    const configs = structuredClone(
      settings.cong_settings.meeting_duties ?? []
    );
    const config = configs.find((item) => item.type === dataView);
    if (!config) return;
    config.schedule_weekly = {
      value: event.target.value === 'weeks',
      updatedAt: new Date().toISOString(),
    };
    setSaving(true);
    try {
      await dutiesSaveSettings(configs);
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : 'error_app_generic-title'
        ),
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return { weekly, saving, handleChange };
};
export default useScheduleMode;
