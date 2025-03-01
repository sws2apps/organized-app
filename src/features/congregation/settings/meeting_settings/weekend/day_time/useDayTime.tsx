import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  hour24FormatState,
  settingsState,
  userDataViewState,
  weekendMeetingTimeState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { generateDateFromTime } from '@utils/date';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate } from '@services/dateformat';

const useDayTime = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const hour24 = useRecoilValue(hour24FormatState);
  const dayInitial = useRecoilValue(weekendMeetingWeekdayState);
  const timeInitial = useRecoilValue(weekendMeetingTimeState);

  const [meetingDay, setMeetingDay] = useState(dayInitial);
  const [meetingTime, setMeetingTime] = useState<Date>(null);

  const handleMeetingDayChange = async (value: number) => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.weekday.value = value;
    current.weekday.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleMeetingTimeChange = async (value: Date) => {
    const time = value ? formatDate(value, 'HH:mm') : '00:00';

    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.time.value = time;
    current.time.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    setMeetingDay(dayInitial);
    setMeetingTime(generateDateFromTime(timeInitial));
  }, [dayInitial, timeInitial]);

  return {
    meetingDay,
    handleMeetingDayChange,
    hour24,
    meetingTime,
    handleMeetingTimeChange,
  };
};

export default useDayTime;
