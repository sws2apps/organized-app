import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  schedulesGetMeetingDate,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import { weekendMeetingOpeningPrayerAutoAssignState } from '@states/settings';

const useWeekItem = (week: string) => {
  const location = useLocation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const prayerAutoAssign = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const meeting = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const isSelected = useMemo(() => {
    return week === selectedWeek;
  }, [week, selectedWeek]);

  const weekDateLocale = useMemo(() => {
    const meetingDate = schedulesGetMeetingDate(week, meeting);

    return meetingDate.locale;
  }, [week, meeting]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meeting);

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, meeting, prayerAutoAssign]);

  const handleSelectWeek = (value: string) => setSelectedWeek(value);

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
