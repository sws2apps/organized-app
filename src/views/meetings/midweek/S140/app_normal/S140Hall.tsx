import { Text, View } from '@react-pdf/renderer';
import { S140HallType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S140Hall = ({ name, counselor, group, lang }: S140HallType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={stylesSmart.hallContainer}>
      <Text style={stylesSmart.hallName}>
        {rtl && '\u200f'}
        {name}
      </Text>
      {counselor && (
        <Text style={stylesSmart.hallCounselor}>
          {rtl && '\u200f'}
          {counselor}
        </Text>
      )}
      {group && (
        <Text style={stylesSmart.hallGroup}>
          {rtl && '\u200f'}
          {group}
        </Text>
      )}
    </View>
  );
};

export default S140Hall;
