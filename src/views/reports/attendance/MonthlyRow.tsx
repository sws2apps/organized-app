import { Text, View } from '@react-pdf/renderer';
import { styles } from './index.styles';
import { MonthlyRowProps } from './index.types';

const MonthlyRow = ({
  column,
  last,
  average,
  count,
  month,
  total,
}: MonthlyRowProps) => {
  return (
    <View
      style={[
        styles.tableContainer,
        styles.leftLargerBorder,
        last ? styles.bottomMediumBorder : styles.bottomNormalBorder,
        column === 2 ? styles.rightLargerBorder : {},
        column === 1 ? styles.leftLargerBorder : {},
      ]}
    >
      <View style={[styles.column1, styles.month]}>
        <Text>{month}</Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column2]}>
        <Text style={[styles.number]}>{count}</Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column3]}>
        <Text style={[styles.number]}>{total}</Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column4]}>
        <Text style={[styles.number]}>{average}</Text>
      </View>
    </View>
  );
};

export default MonthlyRow;
