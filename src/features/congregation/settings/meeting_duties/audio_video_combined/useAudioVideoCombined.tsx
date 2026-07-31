import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesAudioVideoCombinedState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useAudioVideoCombined = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesAudioVideoCombinedState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
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
  };

  useEffect(() => setValue(valueInitial), [valueInitial]);

  return { value, handleValueChange };
};

export default useAudioVideoCombined;
