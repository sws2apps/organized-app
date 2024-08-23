import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import {
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';

const useTreasuresPart = (week: string) => {
  const schedules = useRecoilValue(schedulesState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const dataView = useRecoilValue(userDataViewState);

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

  const showAuxClass = useMemo(() => {
    if (weekType === Week.CO_VISIT) {
      return false;
    }

    if (classCount === 1) {
      return false;
    }

    return true;
  }, [classCount, weekType]);

  return { showAuxClass };
};

export default useTreasuresPart;
