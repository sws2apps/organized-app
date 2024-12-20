import { Text, View } from '@react-pdf/renderer';
import { S89FooterType } from './index.types';
import styles from './index.styles';
import { LANGUAGE_LIST } from '@constants/index';

const S89Footer = ({ lang }: S89FooterType) => {
  const code =
    LANGUAGE_LIST.find((record) => record.locale === lang)?.code || 'E';

  return (
    <View style={styles.footer}>
      <Text>S-89-{code.toUpperCase()}</Text>
      <Text>11/23</Text>
    </View>
  );
};

export default S89Footer;
