import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesState } from '@states/sources';
import { schedulesGetMeetingDate } from '@services/app/schedules';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { JWLangState } from '@states/settings';
import { WeekHeaderType } from './index.types';

const useWeekHeader = ({ dataView, week }: WeekHeaderType) => {
  const sources = useAtomValue(sourcesState);
  const schedules = useAtomValue(schedulesState);
  const lang = useAtomValue(JWLangState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const bible_reading = useMemo(() => {
    if (!source) return '';

    return source.midweek_meeting.weekly_bible_reading[lang] || '';
  }, [source, lang]);

  const week_date = useMemo(() => {
    if (!source) return '';

    const meetingDate = schedulesGetMeetingDate({
      week: source.weekOf,
      meeting: 'midweek',
      forPrint: true,
      dataView,
    });

    return meetingDate.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, weekType]);

  const header = useMemo(() => {
    if (!source) return '';

    if (week_date === '' || bible_reading === '') return '';

    return `${week_date} | ${bible_reading}`;
  }, [source, week_date, bible_reading]);

  return { header };
};

export default useWeekHeader;
