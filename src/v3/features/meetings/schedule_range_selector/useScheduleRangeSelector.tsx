import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ScheduleRangeSelectorType, ScheduleOptionsType } from './index.types';
import { sourcesState } from '@states/sources';
import { getWeekDate } from '@utils/date';
import { monthNamesState } from '@states/app';

const useScheduleRangeSelector = (onStartChange: ScheduleRangeSelectorType['onStartChange']) => {
  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);

  const [startMonth, setStartMonth] = useState('');

  const startMonthOptions = useMemo(() => {
    const recentSources = sources.filter((source) => new Date(source.weekOf) >= getWeekDate());
    recentSources.sort((a, b) => new Date(a.weekOf).getTime() - new Date(b.weekOf).getTime());

    const result: ScheduleOptionsType[] = [];

    for (const source of recentSources) {
      const [year, month] = source.weekOf.split('/');

      const isExist = result.find((schedule) => schedule.value === `${year}${month}`);

      if (!isExist) {
        const monthName = monthNames[+month - 1];
        result.push({ label: `${monthName} ${year}`, value: `${year}${month}` });
      }
    }

    return result;
  }, [sources, monthNames]);

  const endMonthOptions = useMemo(() => {
    if (startMonth.length <= 0) return [];

    const endSchedules = startMonthOptions.filter((schedule) => schedule.value >= startMonth);

    return endSchedules;
  }, [startMonth, startMonthOptions]);

  const handleStartMonthChange = (value: string) => {
    setStartMonth(value);
    onStartChange && onStartChange(value);
  };

  return { handleStartMonthChange, startMonthOptions, endMonthOptions };
};

export default useScheduleRangeSelector;
