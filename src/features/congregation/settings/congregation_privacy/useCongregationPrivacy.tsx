import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  adminRoleState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useCongregationPrivacy = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const isUserAdmin = useRecoilValue(adminRoleState);

  const [timeAwayPublic, setTimeAwayPublic] = useState(false);
  const [outgoingTalksPublic, setOutgoingTalksPublic] = useState(false);

  const handleTimeAwayPublicToggle = async () => {
    const timeAway = structuredClone(settings.cong_settings.time_away_public);

    timeAway.value = !timeAwayPublic;
    timeAway.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.time_away_public': timeAway,
    });
  };

  const handleOutgoingTalksPublicToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.outgoing_talks_schedule_public.value = !outgoingTalksPublic;
    current.outgoing_talks_schedule_public.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    setTimeAwayPublic(settings.cong_settings.time_away_public.value);

    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setOutgoingTalksPublic(
      weekendSettings.outgoing_talks_schedule_public.value
    );
  }, [settings, dataView]);

  return {
    timeAwayPublic,
    outgoingTalksPublic,
    handleTimeAwayPublicToggle,
    handleOutgoingTalksPublicToggle,
    isUserAdmin,
  };
};

export default useCongregationPrivacy;
