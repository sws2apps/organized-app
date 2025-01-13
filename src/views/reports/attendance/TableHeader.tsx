import { Text, View } from '@react-pdf/renderer';
import { styles } from './index.styles';
import { TableHeaderProps } from './index.types';
import { useAppTranslation } from '@hooks/index';

const TableHeader = ({ column, year, locale }: TableHeaderProps) => {
  const { t } = useAppTranslation();

  return (
    <View
      style={[
        styles.topLargeBorder,
        styles.tableContainer,
        column === 1 ? styles.leftLargerBorder : {},
        styles.bottomNormalBorder,
        styles.rightLargerBorder,
      ]}
    >
      <View style={[styles.column1]}>
        <Text style={styles.header}>
          {t('tr_serviceYear', { lng: locale })}
        </Text>
        <Text style={[styles.header, styles.serviceYear]}>{year}</Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column2]}>
        <Text style={styles.header}>
          {t('tr_numberOfMeetings', { lng: locale })}
        </Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column3]}>
        <Text style={styles.header}>
          {t('tr_totalAttendance', { lng: locale })}
        </Text>
      </View>

      <View style={[styles.lineNormalVertical]} />

      <View style={[styles.column4]}>
        <Text style={styles.header}>
          {t('tr_averageAttendanceWeekly', { lng: locale })}
        </Text>
      </View>
    </View>
  );
};

export default TableHeader;
