import { useMemo } from 'react';
import { WeekScheduleHeaderProps } from './index.types';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';

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
