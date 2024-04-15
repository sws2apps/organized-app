import { Text, View } from '@react-pdf/renderer';
import styles from './styles';

const S89DetailsRow = ({ field = '', value = '', align = 'left' }) => {
  return (
    <View style={styles.detailsRow}>
      <Text style={styles.field}>{field}</Text>
      <View style={{ ...styles.fieldValue, textAlign: align }}>
        <Text style={styles.fieldValueText}>{value}</Text>
      </View>
    </View>
  );
};

export default S89DetailsRow;
