import { Html } from 'react-pdf-html';
import { View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S89HeaderType } from './index.types';
import styles from './index.styles';

const S89Header = ({ lang }: S89HeaderType) => {
  const { t } = useAppTranslation();

  const largeLangs = ['k', 'mg'];

  const isLargeHeader = largeLangs.includes(lang.toLowerCase());

  return (
    <View style={styles.header}>
      <Html
        style={{ fontSize: isLargeHeader ? '10px' : styles.header.fontSize }}
      >
        {t('tr_s89Title')}
      </Html>
    </View>
  );
};

export default S89Header;
