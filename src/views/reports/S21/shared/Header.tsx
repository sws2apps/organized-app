import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { styles } from './index.styles';
import { HeaderProps } from './index.types';

const Header = ({ lang }: HeaderProps) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.header}>
      <Text>{t('tr_S21Header', { lng: lang }).toUpperCase()}</Text>
    </View>
  );
};

export default Header;
