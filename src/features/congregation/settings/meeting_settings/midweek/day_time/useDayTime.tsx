import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  hour24FormatState,
  midweekMeetingTimeState,
  midweekMeetingWeekdayState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { formatDate, generateDateFromTime } from '@utils/date';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useDayTime = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const dayInitial = useAtomValue(midweekMeetingWeekdayState);
  const timeInitial = useAtomValue(midweekMeetingTimeState);
  const hour24 = useAtomValue(hour24FormatState);

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
