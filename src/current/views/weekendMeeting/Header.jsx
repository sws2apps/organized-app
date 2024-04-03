import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import WatchtowerIconSVG from './WatchtowerIconSVG';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const WeekendMeetingHeader = () => {
  const { t } = useTranslation('source');

  const { cong_name, cong_number, source_lang } = Setting;

  const weekendMeetingPrint = t('weekendMeetingPrint', { lng: source_lang });

  return (
    <View style={styles.header}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <WatchtowerIconSVG />
        <Text style={styles.headerTittle}>{weekendMeetingPrint}</Text>
      </View>
      <Text style={styles.headerCongregation}>{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
    </View>
  );
};

export default WeekendMeetingHeader;
