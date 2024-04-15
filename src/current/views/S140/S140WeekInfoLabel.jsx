import { Text } from '@react-pdf/renderer';
import styles from './styles';

const S140WeekInfoLabel = ({ weekLabel }) => {
  return <Text style={styles.weekInfoLabel}>{weekLabel}</Text>;
};

export default S140WeekInfoLabel;
