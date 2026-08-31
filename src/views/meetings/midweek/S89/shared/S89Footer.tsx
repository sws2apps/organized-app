import { Text, View } from '@react-pdf/renderer';
import { S89FooterType } from './index.types';
import { LANGUAGE_LIST } from '@constants/index';
import styles from './index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

const S89Footer = ({ lang }: S89FooterType) => {
  const code =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.code ||
    'E';

  const rtlStyles = applyRTL(styles, lang);

  return (
    <View style={rtlStyles.footer}>
      <Text>S-89-{code.toUpperCase()}</Text>
      <Text>11/23</Text>
    </View>
  );
};

export default S89Footer;
