import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S140HeaderType } from '../shared/index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S140Header = ({ cong_name, lang }: S140HeaderType) => {
  const { t } = useAppTranslation();
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={stylesSmart.header} fixed>
      <Text style={stylesSmart.headerTittle}>
        {rtl && '\u200f'}
        {t('tr_midweekMeetingPrint', { lng: lang })}
      </Text>
      <Text style={stylesSmart.headerCongregation}>
        {rtl && '\u200f'}
        {cong_name}
      </Text>
    </View>
  );
};

export default S140Header;
