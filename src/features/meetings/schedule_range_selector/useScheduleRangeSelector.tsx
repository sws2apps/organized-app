import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import {
  getFirstWeekPreviousOrNextMonths,
  getLastWeekPreviousMonth,
  getWeekDate,
  MAX_DATE,
} from '@utils/date';
import { monthNamesState } from '@states/app';
import { JWLangState } from '@states/settings';
import { SourceWeekType } from '@definition/sources';
import { ScheduleRangeSelectorType, ScheduleOptionsType } from './index.types';

const useScheduleRangeSelector = (
  onStartChange: ScheduleRangeSelectorType['onStartChange']
) => {
  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);

  const [startMonth, setStartMonth] = useState('');

  const startMonthOptions = useMemo(() => {
    const filterAndSortSources = (
      sources: SourceWeekType[],
      startDate: Date,
      endDate: Date
    ) => {
      return sources
        .filter(
          (source) =>
            new Date(source.weekOf) >= startDate &&
            new Date(source.weekOf) < endDate &&
            source.midweek_meeting.week_date_locale[lang]
        )
        .sort(
          (a, b) => new Date(a.weekOf).getTime() - new Date(b.weekOf).getTime()
        );
    };

    const generateScheduleOptions = (sources: SourceWeekType[]) => {
      const result: ScheduleOptionsType[] = [];
      for (const source of sources) {
        const [year, month] = source.weekOf.split('/');
        const isExist = result.find(
          (schedule) => schedule.value === `${year}/${month}`
        );
        if (!isExist) {
          const monthName = monthNames[+month - 1];
          result.push({
            label: `${monthName} ${year}`,
            value: `${year}/${month}`,
          });
        }
      }
      return result;
    };

    const previousSources = filterAndSortSources(
      sources,
      getFirstWeekPreviousOrNextMonths(-2),
      getLastWeekPreviousMonth()
    );
    const recentSources = filterAndSortSources(
      sources,
      getWeekDate(),
      MAX_DATE
    );

    const pastResult = generateScheduleOptions(previousSources);
    const result = generateScheduleOptions(recentSources);

    return [pastResult, result];
  }, [sources, monthNames, lang]);

  const endMonthOptions = useMemo(() => {
    if (startMonth.length <= 0) return [[], []];

    const endSchedules = startMonthOptions.map((options) => {
      return options.filter((schedule) => schedule.value >= startMonth);
    });

    return endSchedules;
  }, [startMonth, startMonthOptions]);

  const handleStartMonthChange = (value: string) => {
    setStartMonth(value);
    onStartChange?.(value);
  };

  return {
    handleStartMonthChange,
    startMonthOptions,
    endMonthOptions,
    startMonth,
  };
};

export default useScheduleRangeSelector;
