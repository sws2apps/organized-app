import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { JWLangState, userDataViewState } from '@states/settings';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';

const useWatchtowerStudy = (week: string) => {
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === 'main'
    );

    return type?.value || Week.NORMAL;
  }, [schedule]);

  const showSong = useMemo(() => {
    if (dataView !== 'main' && mainWeekType === Week.CO_VISIT) {
      return false;
    }

    return true;
  }, [dataView, mainWeekType]);

  const articleTitle = useMemo(() => {
    if (!source) return;

    return source.weekend_meeting.w_study[lang];
  }, [source, lang]);

  const showWSReader = useMemo(() => {
    if (dataView === 'main' && weekType === Week.CO_VISIT) {
      return false;
    }

    if (dataView !== 'main' && mainWeekType === Week.CO_VISIT) {
      return false;
    }

    return true;
  }, [weekType, dataView, mainWeekType]);

  return { showWSReader, articleTitle, weekType, showSong };
};

export default useWatchtowerStudy;
