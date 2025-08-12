import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { addMonths, formatDate, getWeekDate } from '@utils/date';
import { userDataViewState } from '@states/settings';
import { ASSIGNMENT_PATH } from '@constants/index';
import { schedulesGetData } from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { monthShortNamesState } from '@states/app';

const useWeekendContainer = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const monthShortNames = useAtomValue(monthShortNamesState);

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    if (schedules.length === 0) return true;

    let noMeeting = true;

    for (const schedule of schedules) {
      if (schedule.weekend_meeting) {
        noMeeting = false;
        break;
      }
    }

    return noMeeting;
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    const minDate = formatDate(addMonths(new Date(), -2), 'yyyy/MM/dd');

    return schedules.filter((record) => record.weekOf >= minDate);
  }, [schedules]);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return null;

    return filteredSchedules.at(value)?.weekOf || null;
  }, [value, filteredSchedules]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule || noSchedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const weekendAssignments = assignments.filter(
      (record) =>
        record[0].includes('WM_') && record[0] !== 'WM_CircuitOverseer'
    );

    const dates: string[] = [];
    for (const [, path] of weekendAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.updatedAt.length > 0) {
        dates.push(assigned.updatedAt);
      }
    }

    const recentDate = dates.sort((a, b) => b.localeCompare(a)).at(0);
    if (!recentDate) return;

    const d = new Date(recentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const monthName = monthShortNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedule, dataView, monthShortNames, t, noSchedule]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = filteredSchedules.findIndex(
      (record) => record.weekOf === weekOf
    );

    setValue(index);
  };

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  return {
    value,
    handleGoCurrent,
    handleValueChange,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    dataView,
  };
};

export default useWeekendContainer;
