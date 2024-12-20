import { View, Text } from '@react-pdf/renderer';
import styles from './index.styles';
import { PageHeaderType } from './index.types';
import { IconGroups } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';

const PageHeader = ({ congregation }: PageHeaderType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.titleContainer}>
      <View style={styles.documentNameContainer}>
        <IconGroups size={18} />
        <Text style={styles.documentNameTypography}>
          {t('tr_fieldServiceGroups')}
        </Text>
      </View>
      <View style={styles.congregationNameContainer}>
        <Text style={styles.congregationName}>{congregation}</Text>
      </View>
    </View>
  );
};

export default PageHeader;
