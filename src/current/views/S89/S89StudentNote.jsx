import { View } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { Html } from 'react-pdf-html';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const S89StudentNote = () => {
  const { t } = useTranslation('source');

  const { source_lang } = Setting;

  return (
    <View style={styles.studentNote}>
      <Html style={{ fontSize: styles.studentNote.fontSize, lineHeight: styles.studentNote.lineHeight }}>
        {t('s89DescFooter', { lng: source_lang })}
      </Html>
    </View>
  );
};

export default S89StudentNote;
