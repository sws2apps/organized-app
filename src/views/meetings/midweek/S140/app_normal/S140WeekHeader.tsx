import { Text, View } from '@react-pdf/renderer';
import { S140WeekHeaderType } from './index.types';
import IconPart from '@views/components/icons/IconPart';
import styles from './index.styles';

const S140WeekHeader = ({ title, secondary }: S140WeekHeaderType) => {
  return (
    <View style={styles.weekHeader}>
      <View style={styles.weekDateContainer}>
        <IconPart />
        <Text style={styles.weekDate}>{title}</Text>
      </View>

      {secondary}
    </View>
  );
};

export default S140WeekHeader;
