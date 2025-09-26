import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { WeekRangeSelectorType } from './index.types';
import { sourcesState } from '@states/sources';
import {
  addDays,
  dateFormatFriendly,
  formatDate,
  getFirstWeekPreviousMonth,
  MAX_DATE,
} from '@utils/date';
import {
  JWLangState,
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekRangeSelector = (
  onStartChange: WeekRangeSelectorType['onStartChange'],
  meeting: WeekRangeSelectorType['meeting']
) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);

  const [startWeek, setStartWeek] = useState('');

  const showDateLabel = useMemo(() => {
    if (meeting === 'duties') return false;

    if (meeting === 'weekend') return true;

    if (!meetingExactDate) return false;

    return true;
  }, [meeting, meetingExactDate]);

  const filterSources = useCallback(
    (startDate: string, endDate: string) => {
      return sources.filter((source) => {
        let toAdd = 0;

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
        ) {
          return false;
        }

        return true;
      });
    },
    [sources, meeting, lang, midweekDay, weekendDay, meetingExactDate]
  );

  const mapSourcesToOptions = useCallback(
    (sourceList: typeof sources) => {
      return sourceList.map((source) => {
        if (meeting === 'duties') {
          return {
            value: source.weekOf,
            label: dateFormatFriendly(source.weekOf),
          };
        }

        const meetingDate = schedulesGetMeetingDate({
          week: source.weekOf,
          meeting,
          key: 'tr_longDateWithYearLocale',
        });

        return {
          label: meetingDate.locale,
          value: source.weekOf,
        };
      });
    },
    [meeting]
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
