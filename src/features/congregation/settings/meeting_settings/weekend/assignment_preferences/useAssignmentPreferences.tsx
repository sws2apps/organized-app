import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  settingsState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
  weekendMeetingSubstituteSpeakerState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useAssignmentPreferences = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const prayerInitial = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const substituteInitial = useAtomValue(weekendMeetingSubstituteSpeakerState);

  const [autoAssignOpeningPrayer, setAutoAssignOpeningPrayer] = useState(false);
  const [substituteSpeakerEnabled, setSubstituteSpeakerEnabled] =
    useState(false);

  const handleAutoOpeningPrayerToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.opening_prayer_auto_assigned.value = !autoAssignOpeningPrayer;
    current.opening_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleSubstituteSpeakerToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.substitute_speaker_enabled.value = !substituteSpeakerEnabled;
    current.substitute_speaker_enabled.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    setAutoAssignOpeningPrayer(prayerInitial);
    setSubstituteSpeakerEnabled(substituteInitial);
  }, [substituteInitial, prayerInitial]);

  return {
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    handleSubstituteSpeakerToggle,
    substituteSpeakerEnabled,
  };
};

export default useAssignmentPreferences;
