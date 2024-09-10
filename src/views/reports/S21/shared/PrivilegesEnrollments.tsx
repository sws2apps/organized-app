import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S21Type } from './index.types';
import { styles } from './index.styles';
import Checkbox from '@views/components/checkbox';

const PrivilegesEnrollments = ({ data }: S21Type) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.headerMultiCheckboxes}>
      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.privileges.elder} />
        <Text style={styles.label}>{t('tr_elder')}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.privileges.ms} />
        <Text style={styles.label}>{t('tr_ministerialServant')}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FR} />
        <Text style={styles.label}>{t('tr_FR')}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FS} />
        <Text style={styles.label}>{t('tr_FS')}</Text>
      </View>

      <View style={[styles.checkbox, styles.fixedLabel]}>
        <Checkbox checked={data.enrollments.FMF} />
        <Text style={styles.label}>{t('tr_FMF')}</Text>
      </View>
    </View>
  );
};

export default PrivilegesEnrollments;
