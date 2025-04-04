import { useEffect, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';
import { sortUpcomingEventsByYear } from '@services/app/upcoming_events';

const useUpcomingEventsList = ({ data }: UpcomingEventsListProps) => {
  const [eventsSortedByYear, setEventsSortedByYear] = useState([[]]);

  useEffect(() => {
    setEventsSortedByYear(sortUpcomingEventsByYear(data));
  }, [data]);

  return {
    eventsSortedByYear,
  };
};

export default useUpcomingEventsList;
