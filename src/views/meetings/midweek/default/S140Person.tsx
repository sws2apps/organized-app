import { Text } from '@react-pdf/renderer';
import { S140PersonType } from './index.types';
import styles from './index.styles';

const S140Person = ({ person }: S140PersonType) => {
  return <Text style={styles.personLabel}>{person}</Text>;
};

export default S140Person;
