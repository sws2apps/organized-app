import { Text, View } from '@react-pdf/renderer';
import { YearlyUpcomingEventsType } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';
import styles from './index.styles';
import DateWithUpcomingEvents from './DateWithUpcomingEvents';

const YearlyUpcomingEvents = (props: YearlyUpcomingEventsType) => {
  // TODO: Rewrite this (move function to another directory) to not call
  // on another file
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

  const eventsSortedByDate = sortEventsByDate(props.events);
  const yearOfThisEvents = new Date(
    props.events[0].event_data.date
  ).getFullYear();

  return (
    <View style={styles.yearlyUpcomingEventsContainer}>
      <View style={styles.yearContainer}>
        <Text style={styles.yearTypography}>{yearOfThisEvents}</Text>
      </View>
      {eventsSortedByDate.map((dateWithUpcomingEvents) => (
        <DateWithUpcomingEvents
          events={dateWithUpcomingEvents}
          key={new Date(dateWithUpcomingEvents[0].event_data.date).getUTCDate()}
          use24
        />
      ))}
    </View>
  );
};

export default YearlyUpcomingEvents;
