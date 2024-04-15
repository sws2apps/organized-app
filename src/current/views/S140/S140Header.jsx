import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const S140Header = () => {
  const { t } = useTranslation('source');

  const { cong_name, cong_number, source_lang } = Setting;

  const midweekMeetingPrint = t('midweekMeetingPrint', { lng: source_lang });

  return (
    <View style={styles.header} fixed>
      <Text>{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
      <Text style={styles.headerMidweekMeeting}>{midweekMeetingPrint}</Text>
    </View>
  );
};

export default S140Header;
