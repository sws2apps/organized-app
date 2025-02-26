import { Text, View } from '@react-pdf/renderer';
import { S140HallType } from './index.types';
import styles from './index.styles';

const S140Hall = ({ name, counselor, group }: S140HallType) => {
  return (
    <View style={styles.hallContainer}>
      <Text style={styles.hallName}>{name}</Text>
      {counselor && <Text style={styles.hallCounselor}>{counselor}</Text>}
      {group && <Text style={styles.hallGroup}>{group}</Text>}
    </View>
  );
};

export default S140Hall;
