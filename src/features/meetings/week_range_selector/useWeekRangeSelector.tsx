import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { WeekRangeSelectorType } from './index.types';
import { sourcesState } from '@states/sources';
import { getFirstWeekPreviousMonth, getWeekDate, MAX_DATE } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { monthNamesState } from '@states/app';
import { JWLangState } from '@states/settings';

const useWeekRangeSelector = (
  onStartChange: WeekRangeSelectorType['onStartChange'],
  meeting: WeekRangeSelectorType['meeting']
) => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);

  const [startWeek, setStartWeek] = useState('');

  const startWeekOptions = useMemo(() => {
    const filterSources = (startDate: Date, endDate: Date) =>
      sources.filter(
        (source) =>
          new Date(source.weekOf) >= startDate &&
          new Date(source.weekOf) < endDate &&
          ((meeting === 'midweek' &&
            source.midweek_meeting.week_date_locale[lang]) ||
            meeting === 'weekend')
      );

    const mapSourcesToOptions = (sourceList: typeof sources) =>
      sourceList.map((source) => {
        const [year, month, date] = source.weekOf.split('/');
        const monthName = monthNames[+month - 1];

        return {
          label: t('tr_longDateWithYearLocale', {
            year,
            month: monthName,
            date,
          }),
          value: source.weekOf,
        };
      });

    const pastSources = filterSources(
      getFirstWeekPreviousMonth(),
      getWeekDate()
    );

    const upcomingSources = filterSources(getWeekDate(), MAX_DATE);

    const pastSourcesOptions = mapSourcesToOptions(pastSources);
    const upcomingSourcesOptions = mapSourcesToOptions(upcomingSources);

    return [pastSourcesOptions, upcomingSourcesOptions];
  }, [sources, t, monthNames, meeting, lang]);

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

  return { endWeekOptions, startWeekOptions, handleStartWeekChange, startWeek };
};

export default useWeekRangeSelector;
