import { Text, View } from '@react-pdf/renderer';
import { DateWithUpcomingEventsType } from './index.types';
import styles from './index.styles';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import UpcomingEvent from './UpcomingEvent';
import { sortUpcomingEventsByTime } from '@services/app/upcoming_events';

const DateWithUpcomingEvents = (props: DateWithUpcomingEventsType) => {
  const { t } = useAppTranslation();

  const dateAsText = formatDate(
    new Date(props.events[0].event_data.date),
    t('tr_longDateFormat')
  );

  let sortedEvents = null;
  if (props.events.length > 1) {
    sortedEvents = sortUpcomingEventsByTime(props.events);
  } else {
    sortedEvents = [...props.events];
  }

  return (
    <View style={styles.dateWithUpcomingEventsContainer}>
      <Text style={styles.dateTypography}>{dateAsText}</Text>
      {sortedEvents.map((event) => (
        <UpcomingEvent
          event={event}
          key={event.event_uid}
          use24={props.use24}
        />
      ))}
    </View>
  );
};

export default DateWithUpcomingEvents;
