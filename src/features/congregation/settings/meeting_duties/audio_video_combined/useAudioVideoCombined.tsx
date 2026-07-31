import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesAudioVideoCombinedState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useAudioVideoCombined = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesAudioVideoCombinedState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties ?? []
      );

      const dutiesByView = meetingDuties.find((duty) => duty.type === dataView);

      if (!dutiesByView) return;

      dutiesByView.av_combined = {
        value: !value,
        updatedAt: new Date().toISOString(),
      };

      await dbAppSettingsUpdate({
        'cong_settings.meeting_duties': meetingDuties,
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    }
  };

  useEffect(() => setValue(valueInitial), [valueInitial]);

  return { value, handleValueChange };
};

export default useAudioVideoCombined;
