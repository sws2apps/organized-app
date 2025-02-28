import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  hour24FormatState,
  midweekMeetingTimeState,
  midweekMeetingWeekdayState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { generateDateFromTime } from '@utils/date';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate } from '@services/dateformat';

const useDayTime = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const dayInitial = useRecoilValue(midweekMeetingWeekdayState);
  const timeInitial = useRecoilValue(midweekMeetingTimeState);
  const hour24 = useRecoilValue(hour24FormatState);

  const [meetingDay, setMeetingDay] = useState(dayInitial);
  const [meetingTime, setMeetingTime] = useState<Date>(null);

  const handleMeetingDayChange = async (value: number) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.weekday.value = value;
    current.weekday.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleMeetingTimeChange = async (value: Date) => {
    const time = value ? formatDate(value, 'HH:mm') : '00:00';

    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.time.value = time;
    current.time.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  useEffect(() => {
    setMeetingDay(dayInitial);
    setMeetingTime(generateDateFromTime(timeInitial));
  }, [timeInitial, dayInitial]);

  return {
    meetingDay,
    handleMeetingDayChange,
    hour24,
    meetingTime,
    handleMeetingTimeChange,
  };
};

export default useDayTime;
