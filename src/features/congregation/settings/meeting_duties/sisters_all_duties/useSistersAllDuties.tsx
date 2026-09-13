import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesSistersAllState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useDutiesSistersAll = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesSistersAllState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
    const meetingDuties = structuredClone(
      settings.cong_settings.meeting_duties ?? []
    );

    const dutiesByView = meetingDuties.find((duty) => duty.type === dataView);

    if (!dutiesByView) return;

    // qualifications already given stay stored, so opening the duties again
    // brings them back; while closed, they are not offered or autofilled
    dutiesByView.sisters_all_duties = {
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

export default useDutiesSistersAll;
