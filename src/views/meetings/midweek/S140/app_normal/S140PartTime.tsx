import { Text, View } from '@react-pdf/renderer';
import { S140PartTimeType } from './index.types';
import styles from './index.styles';

const S140PartTime = ({ time, color, backgroundColor }: S140PartTimeType) => {
  return (
    <View style={{ ...styles.timeContainer, backgroundColor }}>
      <Text style={{ ...styles.timeText, color }}>{time}</Text>
    </View>
  );
};

export default S140PartTime;
