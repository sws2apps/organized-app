import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S21Type } from './index.types';
import { styles } from './index.styles';
import Checkbox from '@views/components/checkbox';

const BasicInfo = ({ data }: S21Type) => {
  const { t } = useAppTranslation();

  return (
    <View>
      <View style={styles.field}>
        <Text style={styles.label}>{t('tr_name')}:</Text>
        <Text>{data.name}</Text>
      </View>

      <View style={styles.headerTwoColumns}>
        <View style={styles.field}>
          <Text style={styles.label}>{t('tr_dateOfBirth')}:</Text>
          <Text>{data.birth_date}</Text>
        </View>

        <View style={styles.header2ndColumn}>
          <View style={[styles.checkbox, { width: '50%' }]}>
            <Checkbox checked={data.gender.male} />
            <Text style={styles.label}>{t('tr_male')}</Text>
          </View>

          <View style={styles.checkbox}>
            <Checkbox checked={data.gender.female} />
            <Text style={styles.label}>{t('tr_female')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerTwoColumns}>
        <View style={styles.field}>
          <Text style={styles.label}>{t('tr_baptismDate')}:</Text>
          <Text>{data.baptism_date}</Text>
        </View>

        <View style={styles.header2ndColumn}>
          <View style={[styles.checkbox, { width: '50%' }]}>
            <Checkbox checked={data.hope.other_sheep} />
            <Text style={styles.label}>{t('tr_otherSheep')}</Text>
          </View>

          <View style={styles.checkbox}>
            <Checkbox checked={data.hope.anointed} />
            <Text style={styles.label}>{t('tr_anointed')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BasicInfo;
