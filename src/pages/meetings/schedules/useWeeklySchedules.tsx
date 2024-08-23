import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WeeklySchedulesType } from './index.types';

const useWeeklySchedules = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const scheduleType = searchParams.get('type') as WeeklySchedulesType;

  const value = useMemo(() => {
    if (scheduleType === 'midweek') return 0;
    if (scheduleType === 'weekend') return 1;
    if (scheduleType === 'outgoing') return 2;
  }, [scheduleType]);

  const handleScheduleChange = (value: number) => {
    let type: WeeklySchedulesType;

    if (value === 0) type = 'midweek';
    if (value === 1) type = 'weekend';
    if (value === 2) type = 'outgoing';

    setSearchParams((params) => {
      params.set('type', type);

      return params;
    });
  };

  return { value, handleScheduleChange };
};

export default useWeeklySchedules;
