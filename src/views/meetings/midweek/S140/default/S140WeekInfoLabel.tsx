import { Text } from '@react-pdf/renderer';
import { S140WeekInfoLabelType } from '../shared/index.types';
import styles from './index.styles';

const S140WeekInfoLabel = ({ weekLabel }: S140WeekInfoLabelType) => {
  return <Text style={styles.weekInfoLabel}>{weekLabel}</Text>;
};

export default S140WeekInfoLabel;
