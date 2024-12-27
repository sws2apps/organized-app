import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { WeekOptionsType, WeekRangeSelectorType } from './index.types';
import { sourcesState } from '@states/sources';
import { getWeekDate } from '@utils/date';
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
    const recentSources = sources.filter(
      (source) =>
        new Date(source.weekOf) >= getWeekDate() &&
        ((meeting === 'midweek' &&
          source.midweek_meeting.week_date_locale[lang]) ||
          meeting === 'weekend')
    );

    const result: WeekOptionsType[] = recentSources.map((source) => {
      const [year, month, date] = source.weekOf.split('/');
      const monthName = monthNames[+month - 1];

      return {
        label: t('tr_longDateWithYearLocale', { year, month: monthName, date }),
        value: source.weekOf,
      };
    });

    return result;
  }, [sources, t, monthNames, meeting, lang]);

  const endWeekOptions = useMemo(() => {
    if (startWeek.length <= 0) return [];

    const endWeekSources = sources.filter(
      (source) =>
        new Date(source.weekOf) >= new Date(startWeek) &&
        ((meeting === 'midweek' &&
          source.midweek_meeting.week_date_locale[lang]) ||
          meeting === 'weekend')
    );

    const result: WeekOptionsType[] = endWeekSources.map((source) => {
      const [year, month, date] = source.weekOf.split('/');
      const monthName = monthNames[+month - 1];

      return {
        label: t('tr_longDateWithYearLocale', { year, month: monthName, date }),
        value: source.weekOf,
      };
    });

    return result;
  }, [sources, t, monthNames, startWeek, meeting, lang]);

  const handleStartWeekChange = (value: string) => {
    setStartWeek(value);
    onStartChange?.(value);
  };

  return { endWeekOptions, startWeekOptions, handleStartWeekChange, startWeek };
};

export default useWeekRangeSelector;
