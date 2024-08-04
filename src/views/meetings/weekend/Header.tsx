import { useAppTranslation } from '@hooks/index';
import { Text, View } from '@react-pdf/renderer';
import { HeaderType } from './index.types';
import IconWatchtower from '@views/icons/IconWatchtower';
import styles from './index.styles';

const Header = ({ cong_name, cong_number }: HeaderType) => {
  const { t } = useAppTranslation();

  return (
    <View fixed style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <IconWatchtower />
        <Text style={styles.headerTittle}>{t('tr_weekendMeetingPrint')}</Text>
      </View>
      <Text style={styles.headerCongregation}>
        {`${cong_name.toUpperCase()} (${cong_number})`}
      </Text>
    </View>
  );
};

export default Header;
