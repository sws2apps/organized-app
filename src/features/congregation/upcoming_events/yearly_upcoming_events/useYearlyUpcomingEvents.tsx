import { useEffect, useState } from 'react';
import { YearlyUpcomingEventsProps } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const useYearlyUpcomingEvents = ({ data }: YearlyUpcomingEventsProps) => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (data.length > 0 && data[0]?.date?.value) {
      setYear(data[0].date.value.getFullYear());
    }
  }, [data]);

  const [eventsSortedByDate, setEventsSortedByDate] = useState([[]]);

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

    const keys = Object.keys(tmpStack);

    if (keys.length == 1) {
      return keys.map((year) => tmpStack[Number(year)]);
    } else {
      return keys
        .sort((a, b) => Number(a) - Number(b))
        .map((year) => tmpStack[Number(year)]);
    }
  };

  return {
    eventsSortedByDate,
    year,
  };
};

export default useYearlyUpcomingEvents;
