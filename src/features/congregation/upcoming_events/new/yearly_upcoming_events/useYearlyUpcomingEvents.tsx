import { useEffect, useState } from 'react';
import { YearlyUpcomingEventsProps } from './index.types';

const useYearlyUpcomingEvents = (props: YearlyUpcomingEventsProps) => {
  const [localDatesWithUpcomingEvents, setLocalDatesWithUpcomingEvents] =
    useState(props.data.dates);

  useEffect(() => {
    setLocalDatesWithUpcomingEvents((prev) =>
      prev.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  }, [localDatesWithUpcomingEvents]);

  return {
    localDatesWithUpcomingEvents,
  };
};

export default useYearlyUpcomingEvents;
