import { Text, View } from '@react-pdf/renderer';
import { S140WeekHeaderType } from './index.types';
import styles from './index.styles';
import IconPart from '@views/components/icons/IconPart';
import IconWavingHand from '@views/components/icons/IconWavingHand';

const S140WeekHeader = ({ title, secondary }: S140WeekHeaderType) => {
  return (
    <View style={styles.weekHeader}>
      <View style={styles.weekDateContainer}>
        <IconPart />
        <Text style={styles.weekDate}>{title}</Text>
      </View>

      {secondary && (
        <View style={styles.coWeekTypeContainer}>
          <IconWavingHand size={10} backgroundColor="none" />
          <Text style={styles.coWeekType}>{secondary}</Text>
        </View>
      )}
    </View>
  );
};

export default S140WeekHeader;
