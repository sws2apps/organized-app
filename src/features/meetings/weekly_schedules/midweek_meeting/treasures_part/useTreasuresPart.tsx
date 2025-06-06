import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import { MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP } from '@constants/index';
import { schedulesState } from '@states/schedules';
import {
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';

const useTreasuresPart = (week: string) => {
  const schedules = useAtomValue(schedulesState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const dataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showAuxClass = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

  return { showAuxClass, weekType };
};

export default useTreasuresPart;
