import { useEffect, useState } from 'react';
import { YearlyUpcomingEventsProps } from './index.types';
import { sortUpcomingEventsByDate } from '@services/app/upcoming_events';

const useYearlyUpcomingEvents = ({ data }: YearlyUpcomingEventsProps) => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (data.length > 0 && data[0]?.event_data.date) {
      setYear(new Date(data[0].event_data.date).getFullYear());
    }
  }, [data]);

  const [eventsSortedByDate, setEventsSortedByDate] = useState([[]]);

  useEffect(() => {
    setEventsSortedByDate(sortUpcomingEventsByDate(data));
  }, [data]);

  return {
    eventsSortedByDate,
    year,
  };
};

export default useYearlyUpcomingEvents;
