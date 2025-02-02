import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { WeekRangeSelectorType } from './index.types';
import { sourcesState } from '@states/sources';
import { addDays, getFirstWeekPreviousMonth, MAX_DATE } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { monthNamesState } from '@states/app';
import {
  JWLangState,
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { formatDate } from '@services/dateformat';

const useWeekRangeSelector = (
  onStartChange: WeekRangeSelectorType['onStartChange'],
  meeting: WeekRangeSelectorType['meeting']
) => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

  const [startWeek, setStartWeek] = useState('');

  const showDateLabel = useMemo(() => {
    if (meeting === 'weekend') return true;

    if (!meetingExactDate) return false;

    return true;
  }, [meeting, meetingExactDate]);

  const filterSources = useCallback(
    (startDate: string, endDate: string) => {
      return sources.filter((source) => {
        let toAdd: number;

        if (meeting === 'midweek') {
          toAdd = meetingExactDate ? midweekDay - 1 : 0;
        }

        if (meeting === 'weekend') {
          toAdd = weekendDay - 1;
        }

        const meetingDate = formatDate(
          addDays(source.weekOf, toAdd),
          'yyyy/MM/dd'
        );

        if (meetingDate < startDate) return false;
        if (meetingDate > endDate) return false;

        if (
          meeting === 'midweek' &&
          !source.midweek_meeting.week_date_locale[lang]
        )
          return false;

        return true;
      });
    },
    [sources, meeting, lang, midweekDay, weekendDay, meetingExactDate]
  );

  const mapSourcesToOptions = useCallback(
    (sourceList: typeof sources) => {
      return sourceList.map((source) => {
        let toAdd: number;

        if (meeting === 'midweek') {
          toAdd = meetingExactDate ? midweekDay - 1 : 0;
        }

        if (meeting === 'weekend') {
          toAdd = weekendDay - 1;
        }

        const meetingDate = addDays(source.weekOf, toAdd);

        const year = meetingDate.getFullYear();
        const month = meetingDate.getMonth();
        const date = meetingDate.getDate();

        const monthName = monthNames[month];

        return {
          label: t('tr_longDateWithYearLocale', {
            year,
            month: monthName,
            date,
          }),
          value: source.weekOf,
        };
      });
    },
    [meeting, meetingExactDate, midweekDay, monthNames, t, weekendDay]
  );

  const startWeekOptions = useMemo(() => {
    let startDate = formatDate(getFirstWeekPreviousMonth(), 'yyyy/MM/dd');
    let endDate = formatDate(new Date(), 'yyyy/MM/dd');

    const pastSources = filterSources(startDate, endDate);

    startDate = formatDate(new Date(), 'yyyy/MM/dd');
    endDate = formatDate(MAX_DATE, 'yyyy/MM/dd');

    const upcomingSources = filterSources(startDate, endDate);

    const pastSourcesOptions = mapSourcesToOptions(pastSources);
    const upcomingSourcesOptions = mapSourcesToOptions(upcomingSources);

    return [pastSourcesOptions, upcomingSourcesOptions];
  }, [filterSources, mapSourcesToOptions]);

  const endWeekOptions = useMemo(() => {
    if (startWeek.length <= 0) return [[], []];

    const result = startWeekOptions.map((options) => {
      return options.filter((schedule) => schedule.value >= startWeek);
    });

    return result;
  }, [startWeek, startWeekOptions]);

  const handleStartWeekChange = (value: string) => {
    setStartWeek(value);
    onStartChange?.(value);
  };

  return {
    endWeekOptions,
    startWeekOptions,
    handleStartWeekChange,
    startWeek,
    showDateLabel,
  };
};

export default useWeekRangeSelector;
