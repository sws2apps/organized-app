import { View } from '@react-pdf/renderer';
import { UpcomingEventsListType } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';
import YearlyUpcomingEvents from './YearlyUpcomingEvents';

const UpcomingEventsList = (props: UpcomingEventsListType) => {
  // TODO: Rewrite this (move function to another directory) to not call
  // on another file
  const sortEventsByYear = (events: UpcomingEventType[]) => {
    if (events.length === 0) {
      return [[]];
    }

    const tmpStack: Record<number, UpcomingEventType[]> = {};

    events.forEach((event) => {
      if (!event.event_data.date) {
        return;
      }
      const year = new Date(event.event_data.date).getFullYear();

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

  const eventsSortedByYear = sortEventsByYear(props.events);

  return (
    <View>
      {eventsSortedByYear.map((yearlyUpcomingEvents) => (
        <YearlyUpcomingEvents
          events={yearlyUpcomingEvents}
          key={new Date(yearlyUpcomingEvents[0].event_data.date).getFullYear()}
        />
      ))}
    </View>
  );
};

export default UpcomingEventsList;
