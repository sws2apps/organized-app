import { Text } from '@react-pdf/renderer';
import styles from './styles';

const S140Person = ({ person }) => {
  return <Text style={styles.personLabel}>{person}</Text>;
};

export default S140Person;
