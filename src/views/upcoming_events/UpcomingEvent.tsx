import { Text, View } from '@react-pdf/renderer';
import { UpcomingEventPDFType } from './index.types';
import styles from './index.styles';

const UpcomingEvent = (props: UpcomingEventPDFType) => {
  console.log(props.event.event_data.time);

  return (
    <View style={styles.upcomingEventContainer}>
      <View style={styles.upcomingEventTimeContainer}>
        <Text style={styles.upcomingEventTimeTypography}>
          {props.event.event_data.time}
        </Text>
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
