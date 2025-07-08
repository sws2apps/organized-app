import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { settingsState } from '@states/settings';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import { WatchtowerStudyProps } from './index.types';

const useWatchtowerStudy = ({ week, dataView }: WatchtowerStudyProps) => {
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const settings = useAtomValue(settingsState);

  const lang = useMemo(() => {
    return (
      settings.cong_settings.source_material.language.find(
        (record) => record.type === dataView
      )?.value ?? 'E'
    );
  }, [settings, dataView]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting?.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
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
