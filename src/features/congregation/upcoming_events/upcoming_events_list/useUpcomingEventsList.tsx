import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';

const useUpcomingEventsList = ({ data }: UpcomingEventsListProps) => {
  const stickyYearRefs = useRef([]);
  const [stuckYearIndexes, setStuckYearIndexes] = useState<Set<number>>(
    new Set()
  );

  const { isAdmin } = useCurrentUser();

  const offsetTopMap = useRef<Map<number, number>>(new Map());

  const isEventExpired = useCallback(
    (event: UpcomingEventType, isAdmin: boolean): boolean => {
      const currentDate = new Date();

      return event.event_data.event_dates.every((event_date) => {
        const endDate = new Date(event_date.end);
        const diffInTime = currentDate.getTime() - endDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        return isAdmin ? diffInDays > 5 : diffInDays > 1;
      });
    },
    []
  );

  const sortEventsByYear = useCallback(
    (events: UpcomingEventType[]) => {
      const yearMap = new Map<number, UpcomingEventType[]>();

      for (const event of events) {
        const dateStr = event.event_data.event_dates?.[0]?.start;
        if (!dateStr || event._deleted || isEventExpired(event, isAdmin))
          continue;

        const year = new Date(dateStr).getFullYear();
        if (!yearMap.has(year)) {
          yearMap.set(year, []);
        }
        yearMap.get(year)!.push(event);
      }

      const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
      return sortedYears.map((year) => yearMap.get(year)!);
    },
    [isAdmin, isEventExpired]
  );

  const eventsSortedByYear = useMemo(() => {
    return sortEventsByYear(data);
  }, [data, sortEventsByYear]);

  useEffect(() => {
    const handleScroll = () => {
      const newStuckSet = new Set<number>();

      stickyYearRefs.current.forEach((element, index) => {
        if (!element || !element.parentElement) {
          return;
        }

        if (!offsetTopMap.current.has(index)) {
          const offset = element.offsetTop - 56;
          if (offset !== 50) {
            offsetTopMap.current.set(index, offset);
          }
        }

        const elementOffsetTop = offsetTopMap.current.get(index);
        if (elementOffsetTop === undefined) return;

        const parentElementTopOffset =
          element.parentElement.offsetTop + element.parentElement.offsetHeight;

        const isStuck =
          window.scrollY >= elementOffsetTop &&
          window.scrollY < parentElementTopOffset - 50 * 2;

        if (isStuck) {
          newStuckSet.add(index);
        }
      });

      setStuckYearIndexes((prev) => {
        const same =
          prev.size === newStuckSet.size &&
          [...prev].every((value) => newStuckSet.has(value));
        return same ? prev : newStuckSet;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    eventsSortedByYear,
    stuckYearIndexes,
    stickyYearRefs,
    isEventExpired,
    isAdmin,
  };
};

export default useUpcomingEventsList;
