import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S21Type } from './index.types';
import { styles } from './index.styles';
import Checkbox from '@views/components/checkbox';

const PrivilegesEnrollments = ({ data, lang }: S21Type) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.headerMultiCheckboxes}>
      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.privileges.elder} />
        <Text style={styles.label}>{t('tr_elder', { lng: lang })}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.privileges.ms} />
        <Text style={styles.label}>
          {t('tr_ministerialServant', { lng: lang })}
        </Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FR} />
        <Text style={styles.label}>{t('tr_FR', { lng: lang })}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FS} />
        <Text style={styles.label}>{t('tr_FS', { lng: lang })}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FMF} />
        <Text style={styles.label}>{t('tr_FMF', { lng: lang })}</Text>
      </View>
    </View>
  );
};

export default PrivilegesEnrollments;
