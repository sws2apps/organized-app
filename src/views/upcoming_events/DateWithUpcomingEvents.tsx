import { Text, View } from '@react-pdf/renderer';
import { DateWithUpcomingEventsType } from './index.types';
import styles from './index.styles';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import UpcomingEvent from './UpcomingEvent';

const DateWithUpcomingEvents = (props: DateWithUpcomingEventsType) => {
  const { t } = useAppTranslation();

  const dateAsText = formatDate(
    new Date(props.events[0].event_data.date),
    t('tr_longDateFormat')
  );

  let sortedEvents = null;
  if (props.events.length > 1) {
    sortedEvents = [...props.events].sort(
      (a, b) =>
        new Date(b.event_data.time).getTime() -
        new Date(a.event_data.time).getTime()
    );
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
