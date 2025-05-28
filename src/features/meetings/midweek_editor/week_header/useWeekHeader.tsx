import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/settings';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekHeader = (weekOf: string) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === weekOf);
  }, [sources, weekOf]);

  const bible_reading = useMemo(() => {
    if (!source) return '';

    return source.midweek_meeting.weekly_bible_reading[lang] || '';
  }, [source, lang]);

  const week_date = useMemo(() => {
    if (!source) return '';

    return schedulesGetMeetingDate(source.weekOf, 'midweek', true);
  }, [source]);

  const header = useMemo(() => {
    if (!source) return '';

    if (week_date === '' || bible_reading === '') return '';

    return `${week_date} | ${bible_reading}`;
  }, [source, week_date, bible_reading]);

  return { header };
};

export default useWeekHeader;
