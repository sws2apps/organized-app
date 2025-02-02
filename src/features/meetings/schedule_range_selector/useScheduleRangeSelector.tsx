import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesState } from '@states/sources';
import {
  addDays,
  getFirstWeekPreviousOrNextMonths,
  getLastWeekPreviousMonth,
  MAX_DATE,
} from '@utils/date';
import { monthNamesState } from '@states/app';
import {
  JWLangState,
  meetingExactDateState,
  midweekMeetingWeekdayState,
} from '@states/settings';
import { SourceWeekType } from '@definition/sources';
import { ScheduleRangeSelectorType, ScheduleOptionsType } from './index.types';
import { formatDate } from '@services/dateformat';

const useScheduleRangeSelector = (
  onStartChange: ScheduleRangeSelectorType['onStartChange']
) => {
  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);

  const [startMonth, setStartMonth] = useState('');

  const filterAndSortSources = useCallback(
    (sources: SourceWeekType[], startMonth: string, endMonth: string) => {
      return sources
        .filter((source) => {
          const toAdd = meetingExactDate ? midweekDay - 1 : 0;

          const meetingMonth = formatDate(
            addDays(source.weekOf, toAdd),
            'yyyyMM'
          );

          if (meetingMonth < startMonth) return false;
          if (meetingMonth > endMonth) return false;
          if (!source.midweek_meeting.week_date_locale[lang]) return false;

          return true;
        })
        .sort((a, b) => a.weekOf.localeCompare(b.weekOf));
    },
    [lang, meetingExactDate, midweekDay]
  );

  const generateScheduleOptions = useCallback(
    (sources: SourceWeekType[]) => {
      const result: ScheduleOptionsType[] = [];

      for (const source of sources) {
        const toAdd = meetingExactDate ? midweekDay - 1 : 0;

        const meetingDate = addDays(source.weekOf, toAdd);

        const year = meetingDate.getFullYear();
        const month = meetingDate.getMonth();
        const label = formatDate(meetingDate, 'yyyy/MM');

        const isExist = result.find((schedule) => schedule.value === label);

        if (!isExist) {
          const monthName = monthNames[month];

          result.push({
            label: `${monthName} ${year}`,
            value: label,
          });
        }
      }
      return result;
    },
    [monthNames, meetingExactDate, midweekDay]
  );

  const startMonthOptions = useMemo(() => {
    let startMonth = formatDate(getFirstWeekPreviousOrNextMonths(-2), 'yyyyMM');
    let endMonth = formatDate(getLastWeekPreviousMonth(), 'yyyyMM');

    const previousSources = filterAndSortSources(sources, startMonth, endMonth);

    startMonth = formatDate(new Date(), 'yyyyMM');
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
