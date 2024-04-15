import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const S89Footer = () => {
  const { source_lang } = Setting;

  return (
    <View style={styles.footer}>
      <Text>S-89-{source_lang.toUpperCase()}</Text>
      <Text>11/23</Text>
    </View>
  );
};

export default S89Footer;
