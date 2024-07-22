import { Text, View } from '@react-pdf/renderer';
import { useRecoilValue } from 'recoil';
import { JWLangState } from '@states/app';
import styles from './index.styles';

const S89Footer = () => {
  const lang = useRecoilValue(JWLangState);

  return (
    <View style={styles.footer}>
      <Text>S-89-{lang.toUpperCase()}</Text>
      <Text>11/23</Text>
    </View>
  );
};

export default S89Footer;
