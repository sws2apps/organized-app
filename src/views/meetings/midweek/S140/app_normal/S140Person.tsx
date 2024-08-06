import { Text, View } from '@react-pdf/renderer';
import { S140PersonType } from './index.types';
import styles from './index.styles';

const S140Person = ({
  primary,
  secondary,
  direction = 'row',
}: S140PersonType) => {
  return (
    <View
      style={{
        ...styles.personContainer,
        flexDirection: direction,
        gap: direction === 'column' ? '2px' : '4px',
      }}
    >
      <Text style={styles.personPrimary}>{primary}</Text>
      {secondary && <Text style={styles.personSecondary}>{secondary}</Text>}
    </View>
  );
};

export default S140Person;
