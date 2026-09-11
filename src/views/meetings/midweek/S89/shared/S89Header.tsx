import { Html } from 'react-pdf-html';
import { View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S89HeaderType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S89Header = ({ lang }: S89HeaderType) => {
  const { t } = useAppTranslation();

  const largeLangs = ['ukr', 'mlg'];

  const isLargeHeader = largeLangs.includes(lang.toLowerCase());
  const rtlStyles = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={rtlStyles.header}>
      <Html
        style={{ fontSize: isLargeHeader ? '10px' : rtlStyles.header.fontSize }}
      >
        {`${rtl ? '\u200f' : ''}${t('tr_s89Title', { lng: lang })}`}
      </Html>
    </View>
  );
};

export default S89Header;
