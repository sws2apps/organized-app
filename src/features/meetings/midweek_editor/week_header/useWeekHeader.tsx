import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  meetingExactDateState,
  midweekMeetingWeekdayState,
} from '@states/settings';
import { addDays } from '@utils/date';
import { generateMonthNames } from '@services/i18n/translation';

const useWeekHeader = (weekOf: string) => {
  const { t } = useAppTranslation();

  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const sourceLang = useAtomValue(JWLangLocaleState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === weekOf);
  }, [sources, weekOf]);

  const bible_reading = useMemo(() => {
    if (!source) return '';

    return source.midweek_meeting.weekly_bible_reading[lang] || '';
  }, [source, lang]);

  const week_date = useMemo(() => {
    if (!source) return '';

    if (!meetingExactDate) {
      return source.midweek_meeting.week_date_locale[lang] || '';
    }

    const toAdd = midweekDay - 1;
    const meetingDate = addDays(source.weekOf, toAdd);

    const month = meetingDate.getMonth();
    const date = meetingDate.getDate();

    const months = generateMonthNames(sourceLang);

    const monthName = months[month];

    return t('tr_longDateNoYearLocale', { month: monthName, date });
  }, [source, lang, t, meetingExactDate, midweekDay, sourceLang]);

  const header = useMemo(() => {
    if (!source) return '';

    if (week_date === '' || bible_reading === '') return '';

    return `${week_date} | ${bible_reading}`;
  }, [source, week_date, bible_reading]);

  return { header };
};

export default useWeekHeader;
