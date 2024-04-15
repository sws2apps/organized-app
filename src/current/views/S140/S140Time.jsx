import { Text } from '@react-pdf/renderer';
import styles from './styles';

const S140Time = ({ time }) => {
  return <Text style={styles.meetingTimeLabel}>{time}</Text>;
};

export default S140Time;
