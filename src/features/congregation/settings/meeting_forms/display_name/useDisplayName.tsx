import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMeetingForms = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [displayNameMeeting, setDisplayNameMeeting] = useState(false);

  const handleDisplayNameMeetingToggle = async () => {
    const displayNameEnabled = structuredClone(
      settings.cong_settings.display_name_enabled.meetings
    );

    displayNameEnabled.value = !displayNameMeeting;
    displayNameEnabled.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.display_name_enabled.meetings': displayNameEnabled,
    });
  };

  useEffect(() => {
    setDisplayNameMeeting(
      settings.cong_settings.display_name_enabled.meetings.value
    );
  }, [settings, dataView]);

  return {
    displayNameMeeting,
    handleDisplayNameMeetingToggle,
  };
};

export default useMeetingForms;
