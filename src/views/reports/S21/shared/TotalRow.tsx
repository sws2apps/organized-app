import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S21Type } from './index.types';
import { styles } from './index.styles';

const TotalRow = ({ data, lang }: S21Type) => {
  const { t } = useAppTranslation();

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={styles.totalLabelField}>
        <View style={[styles.cell, { alignItems: 'flex-end' }]}>
          <Text style={[styles.label, { textAlign: 'right' }]}>
            {t('tr_total', { lng: lang })}
          </Text>
        </View>
      </View>
      <View style={styles.totalRowContainer}>
        <View style={[styles.cell, styles.totalField]}>
          <Text style={[styles.label]}>{data.hours_total}</Text>
        </View>
        <View
          style={{ borderRight: '2px solid black', alignSelf: 'stretch' }}
        />
      </View>
    </View>
  );
};

export default TotalRow;
