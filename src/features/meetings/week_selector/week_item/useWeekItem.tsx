import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
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

  const [selectedWeek, setSelectedWeek] = useRecoilState(selectedWeekState);
  const schedules = useRecoilValue(schedulesState);

  const monthNames = useRecoilValue(monthNamesState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

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

  const handleSelectWeek = (value: string) => setSelectedWeek(value);

  useEffect(() => {
    const loadWeekDetails = async () => {
      const { total, assigned } = await schedulesWeekAssignmentsInfo(
        schedule.weekOf,
        meeting
      );

      setTotal(total);
      setAssigned(assigned);
    };

    if (schedule) {
      loadWeekDetails();
    }
  }, [schedule, meeting]);

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
