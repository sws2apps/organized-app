import { Text, View } from '@react-pdf/renderer';
import { S89DetailsRowType } from './index.types';
import styles from './index.styles';

const S89DetailsRow = ({
  field = '',
  value = '',
  align = 'left',
}: S89DetailsRowType) => {
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
