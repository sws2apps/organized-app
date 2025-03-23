import { useEffect, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const useUpcomingEventsList = ({ data }: UpcomingEventsListProps) => {
  const [eventsSortedByYear, setEventsSortedByYear] =
    useState<UpcomingEventType[][]>(null);

  useEffect(() => {
    setEventsSortedByYear(sortEventsByYear(data));
  }, [data]);

  const sortEventsByYear = (
    events: UpcomingEventType[]
  ): UpcomingEventType[][] => {
    const tmpStack: Record<number, UpcomingEventType[]> = {};

    events.forEach((event) => {
      const year = event.date.value.getFullYear();

      if (!tmpStack[year]) {
        tmpStack[year] = [];
      }

      tmpStack[year].push(event);
    });

    return Object.keys(tmpStack)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => tmpStack[Number(year)]);
  };

  return {
    eventsSortedByYear,
  };
};

export default useUpcomingEventsList;
