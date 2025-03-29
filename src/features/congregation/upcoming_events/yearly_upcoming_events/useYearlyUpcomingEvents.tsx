import { useEffect, useState } from 'react';
import { YearlyUpcomingEventsProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const useYearlyUpcomingEvents = ({ data }: YearlyUpcomingEventsProps) => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (data.length > 0 && data[0]?.event_data.date) {
      setYear(new Date(data[0].event_data.date).getFullYear());
    }
  }, [data]);

  const [eventsSortedByDate, setEventsSortedByDate] = useState([[]]);

  useEffect(() => {
    setEventsSortedByDate(sortEventsByDate(data));
  }, [data]);

  const sortEventsByDate = (
    events: UpcomingEventType[]
  ): UpcomingEventType[][] => {
    if (events.length === 0) {
      return [];
    }
    const tmpStack: Record<number, UpcomingEventType[]> = {};

    events.forEach((event) => {
      if (!event.event_data.date) {
        return;
      }
      const date = new Date(event.event_data.date).getTime();

      if (!tmpStack[date]) {
        tmpStack[date] = [];
      }

      tmpStack[date].push(event);
    });

    const keys = Object.keys(tmpStack);

    if (keys.length === 0) {
      return [];
    } else if (keys.length === 1) {
      return keys.map((year) => tmpStack[Number(year)]);
    } else {
      return keys
        .toSorted((a, b) => Number(a) - Number(b))
        .map((year) => tmpStack[Number(year)]);
    }
  };

  return {
    eventsSortedByDate,
    year,
  };
};

export default useYearlyUpcomingEvents;
