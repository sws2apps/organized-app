import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesMicrophoneSectionsState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMicrophoneSections = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesMicrophoneSectionsState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
    const meetingDuties = structuredClone(
      settings.cong_settings.meeting_duties
    );

    const dutiesByView = meetingDuties.find((duty) => duty.type === dataView);

    dutiesByView.mic_sections = {
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

export default useMicrophoneSections;
