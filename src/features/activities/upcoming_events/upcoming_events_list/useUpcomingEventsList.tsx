import { useEffect, useMemo, useRef, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';

const useUpcomingEventsList = ({ data }: UpcomingEventsListProps) => {
  const { isAdmin } = useCurrentUser();

  const stickyYearRefs = useRef<HTMLDivElement[]>([]);
  const offsetTopMap = useRef<Map<number, number>>(new Map());

  const [offsetLeft, setOffsetLeft] = useState<number | null>(null);
  const [stuckYearIndexes, setStuckYearIndexes] = useState<Set<number>>(
    new Set()
  );

  const eventsSortedByYear = useMemo(() => {
    const yearMap = new Map<number, UpcomingEventType[]>();

    for (const event of data) {
      const dateStr = event.event_data?.start;

      if (!dateStr) continue;

      const year = new Date(dateStr).getFullYear();

      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }

      yearMap.get(year)!.push(event);
    }

    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);

    return sortedYears.map((year) => yearMap.get(year)!);
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      const newStuckSet = new Set<number>();

      const HEADER_HEIGHT = 56;
      const TOP_OFFSET = 50;

      if (offsetLeft === null && stickyYearRefs.current.length > 0) {
        const firstElement = stickyYearRefs.current.find(
          (el) => el?.parentElement
        );

        if (firstElement?.parentElement) {
          const x =
            firstElement.parentElement.getBoundingClientRect().left +
            window.scrollX;

          setOffsetLeft(x);
        }
      }

      stickyYearRefs.current.forEach((element, index) => {
        if (!element || !element.parentElement) {
          return;
        }

        if (!offsetTopMap.current.has(index)) {
          const offset = element.offsetTop - HEADER_HEIGHT;

          if (offset !== TOP_OFFSET) {
            offsetTopMap.current.set(index, offset);
          }
        }

        const elementOffsetTop = offsetTopMap.current.get(index);

        if (elementOffsetTop === undefined) return;

        const parentElementTopOffset =
          element.parentElement.offsetTop + element.parentElement.offsetHeight;

        const isStuck =
          window.scrollY >= elementOffsetTop &&
          window.scrollY < parentElementTopOffset - TOP_OFFSET * 2;

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
  }, [offsetLeft]);

  return {
    eventsSortedByYear,
    stuckYearIndexes,
    stickyYearRefs,
    isAdmin,
    offsetLeft,
  };
};

export default useUpcomingEventsList;
