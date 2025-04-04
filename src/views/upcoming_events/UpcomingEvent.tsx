import { Text, View } from '@react-pdf/renderer';
import { UpcomingEventPDFType } from './index.types';
import styles from './index.styles';
import { formatLongDate } from '@services/dateformat';

const UpcomingEvent = (props: UpcomingEventPDFType) => {
  const getEventTime = formatLongDate(
    new Date(props.event?.event_data?.time),
    '',
    props.use24
  );

  return (
    <View style={styles.upcomingEventContainer}>
      <View style={styles.upcomingEventTimeContainer}>
        <Text style={styles.upcomingEventTimeTypography}>{getEventTime}</Text>
      </View>
      <View style={styles.upcomingEventTitleContainer}>
        <Text style={styles.upcomingEventTitleTypography}>feffergrrpg</Text>
        <Text style={styles.upcomingEventAdditionalTypography}>
          {props.event.event_data.additional}
        </Text>
      </View>
    </View>
  );
};

export default UpcomingEvent;
