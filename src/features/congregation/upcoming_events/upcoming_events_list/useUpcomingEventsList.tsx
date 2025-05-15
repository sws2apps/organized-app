import { useEffect, useMemo, useRef, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const useUpcomingEventsList = ({ data }: UpcomingEventsListProps) => {
  const stickyYearRefs = useRef([]);
  const [stuckYearIndexes, setStuckYearIndexes] = useState<Set<number>>(
    new Set()
  );

  const offsetTopMap = useRef<Map<number, number>>(new Map());

  const sortEventsByYear = (events: UpcomingEventType[]) => {
    if (events.length === 0) {
      return [[]];
    }

    const tmpStack: Record<number, UpcomingEventType[]> = {};

    events.forEach((event) => {
      if (!event.event_data.event_dates[0].start) {
        return;
      }
      const year = new Date(
        event.event_data.event_dates[0].start
      ).getFullYear();

      if (!tmpStack[year]) {
        tmpStack[year] = [];
      }

      tmpStack[year].push(event);
    });

    const keys = Object.keys(tmpStack);

    if (keys.length === 0) {
      return [[]];
    } else if (keys.length === 1) {
      return keys.map((year) => tmpStack[Number(year)]);
    } else {
      return keys
        .toSorted((a, b) => Number(a) - Number(b))
        .map((year) => tmpStack[Number(year)]);
    }
  };

  const eventsSortedByYear = useMemo(() => {
    return sortEventsByYear(data);
  }, [data]);

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

    // initial check in case user reloads page mid-scroll
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    eventsSortedByYear,
    stuckYearIndexes,
    stickyYearRefs,
  };
};

export default useUpcomingEventsList;
