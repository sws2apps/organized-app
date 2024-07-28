import { Text, View } from '@react-pdf/renderer';
import { S140SourceExtendedType } from '../shared/index.types';
import styles from './index.styles';

const S140SourceExtended = ({
  source,
  time,
  bulletColor,
}: S140SourceExtendedType) => {
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
      <Text style={styles.meetingPartText}>
        {source} <Text style={{ fontSize: '8px' }}>({time})</Text>
      </Text>
    </View>
  );
};

export default S140SourceExtended;
