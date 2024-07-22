import Html from 'react-pdf-html';
import { View } from '@react-pdf/renderer';
import { useRecoilValue } from 'recoil';
import { JWLangState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

const S89Header = () => {
  const { t } = useAppTranslation();

  const lang = useRecoilValue(JWLangState);

  const isLargeHeader = lang === 'k';

  return (
    <View style={styles.header}>
      <Html
        style={{ fontSize: isLargeHeader ? '10px' : styles.header.fontSize }}
      >
        {t('s89Title')}
      </Html>
    </View>
  );
};

export default S89Header;
