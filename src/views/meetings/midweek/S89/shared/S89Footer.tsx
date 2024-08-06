import { Text, View } from '@react-pdf/renderer';
import { S89FooterType } from './index.types';
import styles from './index.styles';

const S89Footer = ({ lang }: S89FooterType) => {
  return (
    <View style={styles.footer}>
      <Text>S-89-{lang.toUpperCase()}</Text>
      <Text>11/23</Text>
    </View>
  );
};

export default S89Footer;
