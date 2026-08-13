import { generateWeekday } from '@services/i18n/translation';
import {
  midweekMeetingTimeState,
  midweekMeetingWeekdayState,
  settingsState,
  userDataViewState,
  weekendMeetingTimeState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

const useSWMeetingTimes = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const midweekMeetingDayRaw = useAtomValue(midweekMeetingWeekdayState);
  const midweekMeetingTime = useAtomValue(midweekMeetingTimeState);

  const weekendMeetingDayRaw = useAtomValue(weekendMeetingWeekdayState);
  const weekendMeetingTime = useAtomValue(weekendMeetingTimeState);

  const weekdays = useMemo(() => generateWeekday(), []);

  const midweekMeetingDay = useMemo(
    () => weekdays[midweekMeetingDayRaw],
    [midweekMeetingDayRaw, weekdays]
  );

  const weekendMeetingDay = useMemo(
    () => weekdays[weekendMeetingDayRaw],
    [weekdays, weekendMeetingDayRaw]
  );

  const lastUpdated = useMemo(() => {
    const midweekMeeting = settings.cong_settings.midweek_meeting.find(
      (mm) => mm.type === dataView
    );

    const weekendMeeting = settings.cong_settings.weekend_meeting.find(
      (wm) => wm.type === dataView
    );

    const updates = [
      midweekMeeting?.time.updatedAt,
      midweekMeeting?.weekday.updatedAt,
      weekendMeeting?.time.updatedAt,
      weekendMeeting?.weekday.updatedAt,
    ].filter((date): date is string => date !== undefined);

    if (updates.length === 0) return undefined;

    return new Date(
      Math.max(...updates.map((date) => new Date(date).getTime()))
    );
  }, [
    dataView,
    settings.cong_settings.midweek_meeting,
    settings.cong_settings.weekend_meeting,
  ]);

  return {
    midweekMeetingTime,
    midweekMeetingDay,
    weekendMeetingDay,
    weekendMeetingTime,
    lastUpdated,
  };
};

export default useSWMeetingTimes;
