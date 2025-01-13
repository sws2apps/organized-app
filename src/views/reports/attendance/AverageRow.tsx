import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { styles } from './index.styles';
import { AverageRowProps } from './index.types';

const AverageRow = ({ column, average, locale }: AverageRowProps) => {
  const { t } = useAppTranslation();

  return (
    <View
      style={[
        styles.tableContainer,
        styles.leftLargerBorder,
        styles.bottomLargerBorder,
        column === 2 ? styles.rightLargerBorder : {},
        column === 1 ? styles.leftLargerBorder : {},
      ]}
    >
      <View style={[styles.columnAverageLabel]}>
        <Text>{t('tr_averageAttendanceMonthly', { lng: locale })}</Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.columnAverageNumber]}>
        <Text style={[styles.number]}>{average}</Text>
      </View>
    </View>
  );
};

export default AverageRow;
