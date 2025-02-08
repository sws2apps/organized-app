import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
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

  const [selectedWeek, setSelectedWeek] = useRecoilState(selectedWeekState);

  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const meeting = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const expanded = useMemo(() => {
    return currentExpanded === month.toString();
  }, [currentExpanded, month]);

  const monthName = useMemo(() => {
    return monthNames[month];
  }, [monthNames, month]);

  const assignComplete = useMemo(() => {
    return total === 0 ? false : assigned === total;
  }, [total, assigned]);

  const meeting_month = useMemo(() => {
    if (!selectedWeek) return;

    let toAdd: number;

    if (meeting === 'midweek') {
      toAdd = meetingExactDate ? midweekDay - 1 : 0;
    }

    if (meeting === 'weekend') {
      toAdd = weekendDay - 1;
    }

    const meetingDate = addDays(selectedWeek, toAdd);

    return meetingDate.getMonth().toString();
  }, [selectedWeek, meeting, midweekDay, weekendDay, meetingExactDate]);

  const handleToggleExpand = () => {
    if (currentExpanded === month.toString()) {
      setSelectedWeek('');
      onChangeCurrentExpanded('');
    } else {
      setSelectedWeek('');
      onChangeCurrentExpanded(month.toString());
    }
  };

  useEffect(() => {
    if (!meeting_month) return;

    if (meeting_month !== currentExpanded) {
      onChangeCurrentExpanded(meeting_month);
    }
  }, [meeting_month, onChangeCurrentExpanded, currentExpanded]);

  useEffect(() => {
    const loadMonthDetails = async () => {
      setTotal(0);
      setAssigned(0);

      for await (const week of weeks) {
        const schedule = schedules.find((record) => record.weekOf === week);

        const { assigned, total } = await schedulesWeekAssignmentsInfo(
          schedule.weekOf,
          meeting
        );

        setTotal((prev) => prev + total);
        setAssigned((prev) => prev + assigned);
      }
    };

    loadMonthDetails();
  }, [weeks, schedules, meeting]);

  return { monthName, expanded, handleToggleExpand, assignComplete };
};

export default useMonthItem;
