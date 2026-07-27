import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { FieldServiceMonthProps } from './index.types';
import styles from './index.styles';
import FieldServiceDay from './FieldServiceDay';

const FieldServiceMonth = ({ lang, month }: FieldServiceMonthProps) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.month}>
      <View wrap={false} style={styles.monthHeader}>
        <View style={styles.monthName}>
          <Text style={styles.monthNameText}>{month.title}</Text>
        </View>

        <View style={styles.tableHeader}>
          <View style={styles.headerDateGroup}>
            <Text style={[styles.headerCell, styles.columnDate]}>
              {t('tr_date', { lng: lang })}
            </Text>
            <Text style={[styles.headerCell, styles.columnTime]}>
              {t('tr_timerLabelTime', { lng: lang })}
            </Text>
          </View>

          <Text style={[styles.headerCell, styles.columnText]}>
            {t('tr_address', { lng: lang })}
          </Text>
          <Text style={[styles.headerCell, styles.columnText]}>
            {t('tr_conductor', { lng: lang })}
          </Text>
        </View>
      </View>

      {month.days.map((day, index) => (
        <FieldServiceDay
          key={day.id}
          day={day}
          isLast={index === month.days.length - 1}
        />
      ))}
    </View>
  );
};

export default FieldServiceMonth;
