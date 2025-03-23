import { useEffect, useState } from 'react';
import { YearlyUpcomingEventsProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const useYearlyUpcomingEvents = ({ data }: YearlyUpcomingEventsProps) => {
  const year = data[0].date.value.getFullYear();

  const [eventsSortedByDate, setEventsSortedByDate] =
    useState<UpcomingEventType[][]>(null);

  useEffect(() => {
    setEventsSortedByDate(sortEventsByDate(data));
  }, [data]);

  const sortEventsByDate = (
    events: UpcomingEventType[]
  ): UpcomingEventType[][] => {
    const tmpStack: Record<number, UpcomingEventType[]> = {};

    events.forEach((event) => {
      const date = event.date.value.getTime();

      if (!tmpStack[date]) {
        tmpStack[date] = [];
      }

      tmpStack[date].push(event);
    });

    return Object.keys(tmpStack)
      .sort((a, b) => Number(a) - Number(b))
      .map((year) => tmpStack[Number(year)]);
  };

  return {
    year,
    eventsSortedByDate,
  };
};

export default useYearlyUpcomingEvents;
