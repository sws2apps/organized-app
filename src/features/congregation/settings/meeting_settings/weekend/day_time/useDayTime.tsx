import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { generateDateFromTime } from '@utils/date';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate } from '@services/dateformat';

const useDayTime = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [meetingDay, setMeetingDay] = useState<number | string>('');
  const [meetingTime, setMeetingTime] = useState<Date>(null);

  const hour24 = useMemo(() => {
    const hourFormat = settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    );

    return hourFormat.value;
  }, [settings, dataView]);

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
    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setMeetingDay(weekendSettings.weekday.value);
    setMeetingTime(generateDateFromTime(weekendSettings.time.value));
  }, [settings, dataView]);

  return {
    meetingDay,
    handleMeetingDayChange,
    hour24,
    meetingTime,
    handleMeetingTimeChange,
  };
};

export default useDayTime;
