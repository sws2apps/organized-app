import { Text, View } from '@react-pdf/renderer';
import { S140SourceSimpleType } from '../shared/index.types';
import styles from './index.styles';

const S140SourceSimple = ({ source, bulletColor }: S140SourceSimpleType) => {
  return (
    <View
      style={{
        width: '270px',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '-1px',
      }}
    >
      <Text style={{ ...styles.bulletPoint, color: bulletColor }}>
        {'\u2022'}
      </Text>
      <Text style={styles.meetingPartText}>{source}</Text>
    </View>
  );
};

export default S140SourceSimple;
