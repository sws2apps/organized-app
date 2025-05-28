import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { useAppTranslation } from '@hooks/index';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { addDays } from '@utils/date';

const useWeekItem = (week: string) => {
  const location = useLocation();

  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);
  const schedules = useAtomValue(schedulesState);

  const monthNames = useAtomValue(monthNamesState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const meeting = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const { month, date } = useMemo(() => {
    let toAdd: number;

    if (meeting === 'midweek') {
      toAdd = meetingExactDate ? midweekDay - 1 : 0;
    }

    if (meeting === 'weekend') {
      toAdd = weekendDay - 1;
    }

    const meetingDate = addDays(week, toAdd);

    return { month: meetingDate.getMonth(), date: meetingDate.getDate() };
  }, [week, meeting, midweekDay, weekendDay, meetingExactDate]);

  const isSelected = useMemo(() => {
    return week === selectedWeek;
  }, [week, selectedWeek]);

  const weekDateLocale = useMemo(() => {
    const monthName = monthNames[month];

    const weekDateLocale = t('tr_longDateNoYearLocale', {
      date,
      month: monthName,
    });

    return weekDateLocale;
  }, [date, monthNames, month, t]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meeting);

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
  }, [schedule, meeting]);

  const handleSelectWeek = (value: string) => setSelectedWeek(value);

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
