import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesConflictPreventState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dutiesSaveSettings } from '@services/app/duties';

const useDutiesPreventConflict = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesConflictPreventState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
    const meetingDuties = structuredClone(
      settings.cong_settings.meeting_duties ?? []
    );

    const dutiesByView = meetingDuties.find((duty) => duty.type === dataView);

    if (!dutiesByView) return;

    dutiesByView.conflict_prevent = {
      value: !value,
      updatedAt: new Date().toISOString(),
    };

    try {
      await dutiesSaveSettings(meetingDuties);
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : 'error_app_generic-title'
        ),
        severity: 'error',
      });
    }
  };

  useEffect(() => setValue(valueInitial), [valueInitial]);

  return { value, handleValueChange };
};

export default useDutiesPreventConflict;
