import { View, Text } from '@react-pdf/renderer';
import styles from './index.styles';
import { PageHeaderType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { IconDate } from '@views/components/icons';

const PageHeader = ({ congregation }: PageHeaderType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.titleContainer}>
      <View style={styles.documentNameContainer}>
        <IconDate size={18} />
        <Text style={styles.documentNameTypography}>
          {t('tr_upcomingEvents')}
        </Text>
      </View>
      <View style={styles.congregationNameContainer}>
        <Text style={styles.congregationName}>{congregation}</Text>
      </View>
    </View>
  );
};

export default PageHeader;
