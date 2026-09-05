import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  COMidweekMeetingDayState,
  hour24FormatState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
  userDataViewState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { getHallMeeting } from '@utils/hall_attendant';
import { formatDate, getWeekDate } from '@utils/date';
import { schedulesGetMeetingDate } from '@services/app/schedules';
import { appLocaleState } from '@states/app';

const useHallAttendant = () => {
  const [now, setNow] = useState(() => new Date());
  const hour24 = useAtomValue(hour24FormatState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);
  const dataView = useAtomValue(userDataViewState);
  const locale = useAtomValue(appLocaleState);
  useAtomValue(schedulesState);
  useAtomValue(sourcesState);
  useAtomValue(COMidweekMeetingDayState);
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  const week = formatDate(getWeekDate(new Date(now)), 'yyyy/MM/dd');
  const dates = Object.fromEntries(
    (['midweek', 'weekend'] as const).map((type) => {
      const scheduled = schedulesGetMeetingDate({
        week,
        meeting: type,
        dataView,
      });
      return [type, scheduled.date ? new Date(scheduled.date) : undefined];
    })
  );
  const meeting = getHallMeeting(now, midweekDay, weekendDay, dates);
  return {
    meeting,
    dataView,
    time: formatDate(now, hour24 ? 'HH:mm' : 'h:mm aaa'),
    date: new Intl.DateTimeFormat(locale?.code, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(now),
    meetingDate: new Intl.DateTimeFormat(locale?.code, {
      month: 'long',
      day: 'numeric',
    }).format(meeting.date),
  };
};
export default useHallAttendant;
