import { Text } from '@react-pdf/renderer';
import { S140TimeType } from './index.types';
import styles from './index.styles';

const S140Time = ({ time }: S140TimeType) => {
  return <Text style={styles.meetingTimeLabel}>{time}</Text>;
};

export default S140Time;
