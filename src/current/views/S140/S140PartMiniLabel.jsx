import { Text } from '@react-pdf/renderer';
import styles from './styles';

const S140PartMiniLabel = ({ part }) => {
  return <Text style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}>{part}</Text>;
};

export default S140PartMiniLabel;
