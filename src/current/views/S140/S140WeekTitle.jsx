import { Text } from '@react-pdf/renderer';
import styles from './styles';

const S140WeekTitle = ({ title }) => {
  return <Text style={styles.weekTitle}>{title}</Text>;
};

export default S140WeekTitle;
