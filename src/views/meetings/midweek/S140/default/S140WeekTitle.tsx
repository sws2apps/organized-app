import { Text } from '@react-pdf/renderer';
import { S140WeekTitleType } from '../shared/index.types';
import styles from './index.styles';

const S140WeekTitle = ({ title }: S140WeekTitleType) => {
  return <Text style={styles.weekTitle}>{title}</Text>;
};

export default S140WeekTitle;
