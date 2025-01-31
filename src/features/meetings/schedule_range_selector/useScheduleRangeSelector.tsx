import { useCallback, useMemo, useState } from 'react';
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
import { formatDate } from '@services/dateformat';

const useScheduleRangeSelector = (
  onStartChange: ScheduleRangeSelectorType['onStartChange']
) => {
  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);

  const [startMonth, setStartMonth] = useState('');

  const filterAndSortSources = useCallback(
    (sources: SourceWeekType[], startMonth: string, endMonth: string) => {
      return sources
        .filter(
          (source) =>
            formatDate(new Date(source.weekOf), 'yyyyMM') >= startMonth &&
            formatDate(new Date(source.weekOf), 'yyyyMM') <= endMonth &&
            source.midweek_meeting.week_date_locale[lang]
        )
        .sort((a, b) => a.weekOf.localeCompare(b.weekOf));
    },
    [lang]
  );

  const generateScheduleOptions = useCallback(
    (sources: SourceWeekType[]) => {
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
    },
    [monthNames]
  );

  const startMonthOptions = useMemo(() => {
    let startMonth = formatDate(getFirstWeekPreviousOrNextMonths(-2), 'yyyyMM');
    let endMonth = formatDate(getLastWeekPreviousMonth(), 'yyyyMM');

    const previousSources = filterAndSortSources(sources, startMonth, endMonth);

    startMonth = formatDate(getWeekDate(), 'yyyyMM');
    endMonth = formatDate(MAX_DATE, 'yyyyMM');

    const recentSources = filterAndSortSources(sources, startMonth, endMonth);

    const pastResult = generateScheduleOptions(previousSources);
    const result = generateScheduleOptions(recentSources);

    return [pastResult, result];
  }, [sources, filterAndSortSources, generateScheduleOptions]);

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
