import Html from 'react-pdf-html';
import { View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

const S89StudentNote = () => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.studentNote}>
      <Html
        style={{
          fontSize: styles.studentNote.fontSize,
          lineHeight: styles.studentNote.lineHeight,
        }}
      >
        {t('s89DescFooter')}
      </Html>
    </View>
  );
};

export default S89StudentNote;
