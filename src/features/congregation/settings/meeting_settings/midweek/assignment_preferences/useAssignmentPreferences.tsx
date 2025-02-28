import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useAssignmentPreferences = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const openingInitial = useRecoilValue(midweekMeetingOpeningPrayerAutoAssign);
  const closingInitial = useRecoilValue(midweekMeetingClosingPrayerAutoAssign);

  const [autoAssignOpeningPrayer, setAutoAssignOpeningPrayer] = useState(false);
  const [autoAssignClosingPrayer, setAutoAssignClosingPrayer] = useState(false);

  const handleAutoOpeningPrayerToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.opening_prayer_auto_assigned.value = !autoAssignOpeningPrayer;
    current.opening_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAutoClosingPrayerToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.closing_prayer_auto_assigned.value = !autoAssignClosingPrayer;
    current.closing_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  useEffect(() => {
    setAutoAssignOpeningPrayer(openingInitial);
    setAutoAssignClosingPrayer(closingInitial);
  }, [openingInitial, closingInitial]);

  return {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    autoAssignClosingPrayer,
    handleAutoClosingPrayerToggle,
  };
};

export default useAssignmentPreferences;
