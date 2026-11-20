import { useCallback, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router';
import { schedulesState } from '@states/schedules';
import { addDays, formatDate, getWeekDate } from '@utils/date';
import { OutgoingTalkSchedule, OutgoingTalkSchedules } from './index.types';
import { WeeklySchedulesLocationState } from '@pages/meetings/schedules/index.types';

const useOutgoingTalks = () => {
  const schedules = useAtomValue(schedulesState);

  const location = useLocation();
  const targetWeek = (location.state as WeeklySchedulesLocationState | null)
    ?.week;

  // the navigation already scrolled to, so re-renders keep the user's position
  const scrolledNavigation = useRef<string | null>(null);

  const talkSchedules = useMemo(() => {
    const outgoingSchedules: OutgoingTalkSchedule[] = [];

    const now = getWeekDate();
    const recentWeeks = schedules.filter(
      (schedule) =>
        schedule.weekend_meeting &&
        schedule.weekOf >= formatDate(now, 'yyyy/MM/dd')
    );

    for (const schedule of recentWeeks) {
      const talkSchedules =
        schedule.weekend_meeting?.outgoing_talks.filter(
          (record) => record.value.length > 0 && !record._deleted
        ) ?? [];

      for (const talkSchedule of talkSchedules) {
        const weekday = talkSchedule.congregation.weekday ?? 6;

        outgoingSchedules.push({
          id: talkSchedule.id,
          weekOf: schedule.weekOf,
          date: formatDate(addDays(schedule.weekOf, weekday), 'yyyy/MM/dd'),
          speaker: talkSchedule.value,
          talk: talkSchedule.public_talk,
          congregation: talkSchedule.congregation.name,
        });
      }
    }

    const result = outgoingSchedules.reduce(
      (acc: OutgoingTalkSchedules[], schedule) => {
        const dataExist = acc.find((record) => record.date === schedule.date);

        if (!dataExist) {
          acc.push({
            date: schedule.date,
            schedules: [schedule],
          });
        }

        if (dataExist) {
          dataExist.schedules.push(schedule);
        }

        return acc;
      },
      []
    );

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [schedules]);

  const noSchedule = useMemo(() => {
    return talkSchedules.length === 0;
  }, [talkSchedules]);

  // the talk opened from another page, such as My assignments
  const targetDate = useMemo(() => {
    if (!targetWeek) return;

    return talkSchedules.find((item) =>
      item.schedules.some((schedule) => schedule.weekOf === targetWeek)
    )?.date;
  }, [talkSchedules, targetWeek]);

  const targetRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || scrolledNavigation.current === location.key) return;

      scrolledNavigation.current = location.key;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [location.key]
  );

  return { talkSchedules, noSchedule, targetDate, targetRef };
};

export default useOutgoingTalks;
