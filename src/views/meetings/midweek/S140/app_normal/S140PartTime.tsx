import { Text, View } from '@react-pdf/renderer';
import { S140PartTimeType } from './index.types';
import styles from './index.styles';

const S140PartTime = ({
  time,
  color,
  backgroundColor,
  isClosingSong,
}: S140PartTimeType) => {
  const conditionalStyle = isClosingSong ? { borderBottomLeftRadius: 6 } : {};

  return (
    <View
      style={{ ...styles.timeContainer, backgroundColor, ...conditionalStyle }}
    >
      <Text style={{ ...styles.timeText, color }}>{time}</Text>
    </View>
  );
};

export default S140PartTime;
