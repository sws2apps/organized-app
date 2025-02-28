import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  displayNameMeetingsEnableState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMeetingForms = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const meetingInitial = useRecoilValue(displayNameMeetingsEnableState);

  const [displayNameMeeting, setDisplayNameMeeting] = useState(false);

  const handleDisplayNameMeetingToggle = async () => {
    let displayName = structuredClone(
      settings.cong_settings.display_name_enabled
    );

    if (!Array.isArray(displayName)) {
      const dateA = displayName['meetings']['updatedAt'];
      const dateB = displayName['others']['updatedAt'];
      const meetings = displayName['meetings']['value'];
      const others = displayName['others']['value'];

      displayName = [
        {
          type: 'main',
          updatedAt: dateA > dateB ? dateA : dateB,
          _deleted: false,
          meetings,
          others,
        },
      ];
    }

    const findRecord = displayName.find((record) => record.type === dataView);

    if (findRecord) {
      findRecord.meetings = !displayNameMeeting;
      findRecord.updatedAt = new Date().toISOString();
    }

    await dbAppSettingsUpdate({
      'cong_settings.display_name_enabled': displayName,
    });
  };

  useEffect(() => {
    setDisplayNameMeeting(meetingInitial);
  }, [meetingInitial]);

  return {
    displayNameMeeting,
    handleDisplayNameMeetingToggle,
  };
};

export default useMeetingForms;
