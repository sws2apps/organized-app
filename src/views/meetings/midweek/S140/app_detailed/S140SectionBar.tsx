import { Text, View } from '@react-pdf/renderer';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import { S140SectionBarType } from './index.types';
import styles from './index.styles';

const S140SectionBar = ({ icon, section, color, lang }: S140SectionBarType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View
      style={[stylesSmart.sectionBar, { backgroundColor: color }]}
      minPresenceAhead={40}
      wrap={false}
    >
      {icon}
      <Text style={stylesSmart.sectionTitle}>
        {rtl && '\u200f'}
        {section}
      </Text>
    </View>
  );
};

export default S140SectionBar;
