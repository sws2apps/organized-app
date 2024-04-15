import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../../classes/Setting';
import styles from './styles';

const ScheduleHeader = () => {
  const { t } = useTranslation('source');

  const { cong_name, cong_number, source_lang } = Setting;

  const weekendMeetingPrint = t('weekendMeetingPrint', { lng: source_lang });

  return (
    <View style={styles.header} fixed>
      <Text>{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
      <Text style={styles.headerText}>{weekendMeetingPrint}</Text>
    </View>
  );
};

export default ScheduleHeader;
