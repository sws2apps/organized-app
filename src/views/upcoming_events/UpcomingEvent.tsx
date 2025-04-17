import { Text, View } from '@react-pdf/renderer';
import { UpcomingEventPDFType } from './index.types';
import styles from './index.styles';
import { formatLongDate } from '@services/dateformat';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import { decorationsForEvent } from '@features/congregation/upcoming_events/decorations_for_event';
import { useAppTranslation } from '@hooks/index';

const UpcomingEvent = (props: UpcomingEventPDFType) => {
  const { t } = useAppTranslation();

  const getEventTime = formatLongDate(
    new Date(props.event?.event_data?.time),
    '',
    props.use24
  );

  const upcomingEventType = props.event.event_data.type;
  const upcomingEventTitle =
    upcomingEventType === UpcomingEventCategory.Custom
      ? props.event.event_data.custom ||
        t(decorationsForEvent[upcomingEventType].translationKey)
      : t(decorationsForEvent[upcomingEventType].translationKey);

  return (
    <View style={styles.upcomingEventContainer}>
      <View style={styles.upcomingEventTimeContainer}>
        <Text style={styles.upcomingEventTimeTypography}>{getEventTime}</Text>
      </View>
      <View style={styles.upcomingEventTitleContainer}>
        <Text style={styles.upcomingEventTitleTypography}>
          {upcomingEventTitle}
        </Text>
        <Text style={styles.upcomingEventAdditionalTypography}>
          {props.event.event_data.additional}
        </Text>
      </View>
    </View>
  );
};

export default UpcomingEvent;
