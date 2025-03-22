import { useEffect, useState } from 'react';
import { UpcomingEventsListProps } from './index.types';

const useUpcomingEventsList = (props: UpcomingEventsListProps) => {
  const [localYearsWithEvents, setLocalYearsWithEvents] = useState(props.data);

  useEffect(() => {
    setLocalYearsWithEvents((prev) =>
      prev.sort((a, b) => parseInt(a.year) - parseInt(b.year))
    );
  }, [localYearsWithEvents]);

  return {
    localYearsWithEvents,
  };
};

export default useUpcomingEventsList;
