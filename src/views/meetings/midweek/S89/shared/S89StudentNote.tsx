import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S89StudentNoteProps } from './index.types';
import styles from './index.styles';

const S89StudentNote = ({ lang }: S89StudentNoteProps) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.studentNote}>
      <Text>{t('tr_s89DescFooter', { lng: lang })}</Text>
    </View>
  );
};

export default S89StudentNote;
