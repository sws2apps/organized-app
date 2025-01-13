import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S140HeaderType } from '../shared/index.types';
import styles from './index.styles';

const S140Header = ({ cong_name, lang }: S140HeaderType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.header} fixed>
      <Text>{cong_name.toUpperCase()}</Text>
      <Text style={styles.headerMidweekMeeting}>
        {t('tr_midweekMeetingPrint', { lng: lang })}
      </Text>
    </View>
  );
};

export default S140Header;
