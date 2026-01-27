import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';
import { MonthItemType } from './index.types';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { addDays } from '@utils/date';

const useMonthItem = ({
  month,
  weeks,
  currentExpanded,
  onChangeCurrentExpanded,
}: MonthItemType) => {
  const location = useLocation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const monthNames = useAtomValue(monthNamesState);
  const schedules = useAtomValue(schedulesState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);

  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const meeting = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const expanded = useMemo(() => {
    return currentExpanded === month.toString();
  }, [currentExpanded, month]);

  const monthName = useMemo(() => {
    const monthIndex = +month.split('/')[1] - 1;
    return monthNames[monthIndex];
  }, [monthNames, month]);

  const assignComplete = useMemo(() => {
    return total === 0 ? false : assigned === total;
  }, [total, assigned]);

  const meeting_month = useMemo(() => {
    if (!selectedWeek) return;

    let toAdd: number;

    if (meeting === 'midweek') {
      toAdd = meetingExactDate ? midweekDay : 0;
    }

    if (meeting === 'weekend') {
      toAdd = weekendDay;
    }

    const meetingDate = addDays(selectedWeek, toAdd);

    const year = meetingDate.getFullYear();
    const monthIndex = meetingDate.getMonth();
    const month = `${year}/${String(monthIndex + 1).padStart(2, '0')}`;

    return month;
  }, [selectedWeek, meeting, midweekDay, weekendDay, meetingExactDate]);

  const counts = useMemo(() => {
    let total = 0;
    let assigned = 0;

    for (const week of weeks) {
      const schedule = schedules.find((record) => record.weekOf === week);

      if (!schedule) {
        continue;
      }

      const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meeting);

      total += data.total;
      assigned += data.assigned;
    }

    return { total, assigned };
  }, [weeks, schedules, meeting]);

  const handleToggleExpand = () => {
    if (currentExpanded === month) {
      setSelectedWeek('');
      onChangeCurrentExpanded('');
    } else {
      setSelectedWeek('');
      onChangeCurrentExpanded(month);
    }
  };

  useEffect(() => {
    if (!meeting_month) return;

    if (meeting_month !== currentExpanded) {
      onChangeCurrentExpanded(meeting_month);
    }
  }, [meeting_month, onChangeCurrentExpanded, currentExpanded]);

  useEffect(() => {
    setTotal(counts.total);
    setAssigned(counts.assigned);
  }, [counts]);

  return { monthName, expanded, handleToggleExpand, assignComplete };
};

export default useMonthItem;
