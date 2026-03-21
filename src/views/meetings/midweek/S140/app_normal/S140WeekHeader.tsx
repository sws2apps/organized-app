import { Text, View } from '@react-pdf/renderer';
import { S140WeekHeaderType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

import IconPart from '@views/components/icons/IconPart';
import IconWavingHand from '@views/components/icons/IconWavingHand';

const S140WeekHeader = ({ title, secondary, lang }: S140WeekHeaderType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={stylesSmart.weekHeader}>
      <View style={stylesSmart.weekDateContainer}>
        <IconPart />
        <Text style={stylesSmart.weekDate}>
          {rtl && '\u200f'}
          {title}
        </Text>
      </View>

      {secondary && (
        <View style={stylesSmart.coWeekTypeContainer}>
          <IconWavingHand size={10} />
          <Text style={stylesSmart.coWeekType}>{secondary}</Text>
        </View>
      )}
    </View>
  );
};

export default S140WeekHeader;
