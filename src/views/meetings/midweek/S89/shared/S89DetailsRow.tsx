import { Text, View } from '@react-pdf/renderer';
import { S89DetailsRowType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S89DetailsRow = ({
  field = '',
  value = '',
  align = 'left',
  lang,
}: S89DetailsRowType & { lang: string }) => {
  const rtlStyles = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={rtlStyles.detailsRow}>
      <Text style={rtlStyles.field}>
        {rtl && '\u200f'}
        {field}
        {rtl && '\u200f'}
      </Text>
      <View style={{ ...rtlStyles.fieldValue, textAlign: rtl ? 'right' : align }}>
        <Text style={rtlStyles.fieldValueText}>
          {rtl && '\u200f'}
          {value}
        </Text>
      </View>
    </View>
  );
};

export default S89DetailsRow;
