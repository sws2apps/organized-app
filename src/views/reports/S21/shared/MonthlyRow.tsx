import { Text, View } from '@react-pdf/renderer';
import { S21MonthType } from './index.types';
import { styles } from './index.styles';
import Checkbox from '@views/components/checkbox';

const MonthlyRow = ({ data, isLast }: S21MonthType) => {
  return (
    <View style={[styles.tableRow, !isLast && styles.lineHorizontal]}>
      <View style={[styles.cell, styles.column1, { alignItems: 'flex-start' }]}>
        <Text>{data.month_name}</Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column2]}>
        <Checkbox checked={data.shared} />
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column3]}>
        <Text>{data.bible_studies}</Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column4]}>
        <Checkbox checked={data.AP} />
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column5]}>
        <Text>{data.hours}</Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column6, styles.commentsField]}>
        <Text style={{ fontSize: '9px', height: '12px' }}>{data.remarks}</Text>
      </View>
    </View>
  );
};

export default MonthlyRow;
