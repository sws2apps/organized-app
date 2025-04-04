import { Text, View } from '@react-pdf/renderer';
import { YearlyUpcomingEventsType } from './index.types';
import styles from './index.styles';
import DateWithUpcomingEvents from './DateWithUpcomingEvents';
import { sortUpcomingEventsByDate } from '@services/app/upcoming_events';

const YearlyUpcomingEvents = (props: YearlyUpcomingEventsType) => {
  const eventsSortedByDate = sortUpcomingEventsByDate(props.events);

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
          use24={props.use24}
        />
      ))}
    </View>
  );
};

export default YearlyUpcomingEvents;
