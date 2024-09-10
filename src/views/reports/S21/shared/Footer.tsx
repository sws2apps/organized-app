import { Text } from '@react-pdf/renderer';
import { S21Type } from './index.types';
import { styles } from './index.styles';

const Footer = ({ data }: S21Type) => {
  return (
    <Text style={styles.footerText}>
      S-21-{data.lang}
      {`  `}11/23
    </Text>
  );
};

export default Footer;
