import { Text } from '@react-pdf/renderer';
import { S140PartMiniLabelType } from '../shared/index.types';
import styles from './index.styles';

const S140PartMiniLabel = ({ part }: S140PartMiniLabelType) => {
  return (
    <Text
      style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}
    >
      {part}
    </Text>
  );
};

export default S140PartMiniLabel;
