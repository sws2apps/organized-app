import { useMemo } from 'react';
import { formatDate, getWeekDate } from '@utils/date';
import { WeekScheduleHeaderProps } from './index.types';

const useWeekScheduleHeader = ({
  week,
}: WeekScheduleHeaderProps) => {
  const currentWeek = useMemo(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return weekOf;
  }, []);

  const showToCurrent = useMemo(() => {
    if (!week) return false;
    return currentWeek !== week;
  }, [currentWeek, week]);

  return { showToCurrent };
};

export default useWeekScheduleHeader;
