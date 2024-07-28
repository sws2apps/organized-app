import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S140HeaderType } from '../shared/index.types';
import styles from './index.styles';

const S140Header = ({ cong_name, cong_number }: S140HeaderType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.header} fixed>
      <Text style={styles.headerTittle}>{t('tr_midweekMeetingPrint')}</Text>
      <Text style={styles.headerCongregation}>
        {cong_name} ({cong_number})
      </Text>
    </View>
  );
};

export default S140Header;
