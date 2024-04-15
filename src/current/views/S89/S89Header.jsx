import { useTranslation } from 'react-i18next';
import { View } from '@react-pdf/renderer';
import { Setting } from '../../classes/Setting';
import Html from 'react-pdf-html';
import styles from './styles';

const S89Header = () => {
  const { t } = useTranslation('source');

  const { source_lang } = Setting;

  const isLargeHeader = source_lang === 'k';

  return (
    <View style={styles.header}>
      <Html style={{ fontSize: isLargeHeader ? '10px' : styles.header.fontSize }}>
        {t('s89Title', { lng: source_lang })}
      </Html>
    </View>
  );
};

export default S89Header;
