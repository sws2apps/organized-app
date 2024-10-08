import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useOutgoingTalkAccess = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [outgoingTalksPublic, setOutgoingTalksPublic] = useState(false);

  const handleOutgoingTalksPublicToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    for (const current of weekendSettings) {
      current.outgoing_talks_schedule_public.value = !outgoingTalksPublic;
      current.outgoing_talks_schedule_public.updatedAt =
        new Date().toISOString();
    }

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setOutgoingTalksPublic(
      weekendSettings.outgoing_talks_schedule_public.value
    );
  }, [settings, dataView]);

  return {
    outgoingTalksPublic,
    handleOutgoingTalksPublicToggle,
  };
};

export default useOutgoingTalkAccess;
