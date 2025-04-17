import { View } from '@react-pdf/renderer';
import { UpcomingEventsListType } from './index.types';
import YearlyUpcomingEvents from './YearlyUpcomingEvents';
import styles from './index.styles';
import { sortUpcomingEventsByYear } from '@services/app/upcoming_events';

const UpcomingEventsList = (props: UpcomingEventsListType) => {
  const eventsSortedByYear = sortUpcomingEventsByYear(props.events);

  return (
    <View style={styles.upcomingEventsListContainer}>
      {eventsSortedByYear.map((yearlyUpcomingEvents) => (
        <YearlyUpcomingEvents
          events={yearlyUpcomingEvents}
          key={new Date(yearlyUpcomingEvents[0].event_data.date).getFullYear()}
          use24={props.use24}
        />
      ))}
    </View>
  );
};

export default UpcomingEventsList;
