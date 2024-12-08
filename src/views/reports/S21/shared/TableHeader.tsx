import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { styles } from './index.styles';
import { S21Type } from './index.types';

const TableHeader = ({ data }: S21Type) => {
  const { t } = useAppTranslation();

  return (
    <View style={[styles.tableRow, styles.lineHorizontal]}>
      <View style={[styles.cell, styles.column1]}>
        <View style={styles.columnTwoRows}>
          <Text style={[styles.label, styles.columnHeader]}>
            {t('tr_serviceYear').replaceAll('-', '-\u000A')}
          </Text>
          <Text>{data.year}</Text>
        </View>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column2]}>
        <Text style={[styles.label, styles.columnHeader]}>
          {t('tr_sharedInMinistry')}
        </Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column3]}>
        <Text style={[styles.label, styles.columnHeader]}>
          {t('tr_bibleStudies')}
        </Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column4]}>
        <Text style={[styles.label, styles.columnHeader]}>{t('tr_AP')}</Text>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column5]}>
        <View style={[styles.columnTwoRows, { gap: '0px' }]}>
          <Text style={[styles.label, styles.columnHeader]}>
            {t('tr_hours')}
          </Text>
          <Text style={styles.columnHeader}>{t('tr_S21HoursComment')}</Text>
        </View>
      </View>
      <View style={styles.lineVertical} />
      <View style={[styles.cell, styles.column6]}>
        <Text style={[styles.label, styles.columnHeader]}>
          {t('tr_remarks')}
        </Text>
      </View>
    </View>
  );
};

export default TableHeader;
