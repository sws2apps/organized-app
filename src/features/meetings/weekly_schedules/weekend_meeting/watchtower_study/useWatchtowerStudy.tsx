import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { JWLangState, userDataViewState } from '@states/settings';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';

const useWatchtowerStudy = (week: string) => {
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);

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

  const articleTitle = useMemo(() => {
    if (!source) return;

    return source.weekend_meeting.w_study[lang];
  }, [source, lang]);

  const showWSReader = useMemo(() => {
    if (weekType === Week.CO_VISIT) return false;

    return true;
  }, [weekType]);

  return { showWSReader, articleTitle, weekType };
};

export default useWatchtowerStudy;
