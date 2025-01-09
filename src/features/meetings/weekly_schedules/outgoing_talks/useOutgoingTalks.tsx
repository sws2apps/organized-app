import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';

const useOutgoingTalks = () => {
  const schedules = useRecoilValue(schedulesState);

  const weeks = useMemo(() => {
    const dates: string[] = [];

    for (const schedule of schedules) {
      const cnTalks = schedule.weekend_meeting.outgoing_talks.filter(
        (record) => record.speaker.length > 0
      );

      if (cnTalks.length > 0) {
        dates.push(schedule.weekOf);
      }
    }

    return dates.sort((a, b) => a.localeCompare(b));
  }, [schedules]);

  const noSchedule = useMemo(() => {
    return weeks.length === 0;
  }, [weeks]);

  return { weeks, noSchedule };
};

export default useOutgoingTalks;
