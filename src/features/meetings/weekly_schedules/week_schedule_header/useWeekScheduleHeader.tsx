import { useMemo } from 'react';
import { formatDate, getWeekDate } from '@utils/date';
import { WeekScheduleHeaderProps } from './index.types';

const useWeekScheduleHeader = ({
  currentVisible,
  week,
}: WeekScheduleHeaderProps) => {
  const currentWeek = useMemo(() => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    return weekOf;
  }, []);

  const showToCurrent = useMemo(() => {
    if (currentWeek === week) return false;

    return !currentVisible;
  }, [currentWeek, week, currentVisible]);

  return { showToCurrent };
};

export default useWeekScheduleHeader;
