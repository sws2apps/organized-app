import { Text, View } from '@react-pdf/renderer';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import IconPart from '@views/components/icons/IconPart';
import IconWavingHand from '@views/components/icons/IconWavingHand';
import { S140WeekHeaderType } from './index.types';
import styles from './index.styles';

const S140WeekHeader = ({ title, event, lang }: S140WeekHeaderType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={stylesSmart.weekHeader} wrap={false}>
      <View style={stylesSmart.weekTitleContainer}>
        <IconPart />
        <Text style={stylesSmart.weekTitle}>
          {rtl && '\u200f'}
          {title}
        </Text>
      </View>

      {event && (
        <View style={stylesSmart.eventBadge}>
          <IconWavingHand size={10} color="#6876BE" />
          <Text style={stylesSmart.eventText}>
            {rtl && '\u200f'}
            {event}
          </Text>
        </View>
      )}
    </View>
  );
};

export default S140WeekHeader;
