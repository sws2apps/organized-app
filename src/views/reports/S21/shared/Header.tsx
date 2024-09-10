import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { styles } from './index.styles';

const Header = () => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.header}>
      <Text>{t('tr_S21Header')}</Text>
    </View>
  );
};

export default Header;
