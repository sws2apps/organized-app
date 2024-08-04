import { Text } from '@react-pdf/renderer';
import { EventDataType } from './index.types';
import styles from './index.styles';

const EventData = ({ meetingData }: EventDataType) => {
  return (
    <>
      {/* 1st row: week type */}
      <Text style={styles.talkTitle}>{meetingData.week_type_name}</Text>

      {/* 2nd row: event name */}
      {meetingData.event_name && (
        <Text style={styles.speaker}>{meetingData.event_name}</Text>
      )}
    </>
  );
};

export default EventData;
