import { Text, View } from '@react-pdf/renderer';
import styles from './styles';

const S140SourceSimple = ({ source, bulletColor }) => {
  return (
    <View style={{ width: '270px', flexDirection: 'row', alignItems: 'flex-start', marginTop: '-1px' }}>
      <Text style={{ ...styles.bulletPoint, color: bulletColor }}>{'\u2022'}</Text>
      <Text style={styles.meetingPartText}>{source}</Text>
    </View>
  );
};

export default S140SourceSimple;
