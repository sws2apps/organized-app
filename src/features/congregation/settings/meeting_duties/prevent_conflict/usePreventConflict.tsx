import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesConflictPreventState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useDutiesPreventConflict = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const valueInitial = useAtomValue(dutiesConflictPreventState);

  const [value, setValue] = useState(false);

  const handleValueChange = async () => {
    const meetingDuties = structuredClone(
      settings.cong_settings.meeting_duties
    );

    const dutiesByView = meetingDuties.find((duty) => duty.type === dataView);

    dutiesByView.conflict_prevent = {
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

export default useDutiesPreventConflict;
