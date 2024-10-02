import { useMemo } from 'react';
import { WeeklySchedulesType } from './index.types';
import { localStorageGetItem } from '@utils/common';

const LOCALSTORAGE_KEY = 'organized_weekly_schedules';

const useWeeklySchedules = () => {
  const scheduleType = localStorageGetItem(
    LOCALSTORAGE_KEY
  ) as WeeklySchedulesType;

  const value = useMemo(() => {
    if (!scheduleType) return 0;

    if (scheduleType === 'midweek') return 0;
    if (scheduleType === 'weekend') return 1;
    if (scheduleType === 'outgoing') return 2;
  }, [scheduleType]);

  const handleScheduleChange = (value: number) => {
    let type: WeeklySchedulesType;

    if (value === 0) type = 'midweek';
    if (value === 1) type = 'weekend';
    if (value === 2) type = 'outgoing';

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
  };

  return { value, handleScheduleChange };
};

export default useWeeklySchedules;
