import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { Text, View } from '@react-pdf/renderer';
import { congNameState, congNumberState } from '@states/settings';
import styles from './index.styles';
import WatchtowerIconSVG from './WatchtowerIconSVG';

const WeekendMeetingHeader = () => {
  const { t } = useAppTranslation();

  const cong_name = useRecoilValue(congNameState);
  const cong_number = useRecoilValue(congNumberState);

  return (
    <View style={styles.header}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <WatchtowerIconSVG />
        <Text style={styles.headerTittle}>{t('weekendMeetingPrint')}</Text>
      </View>
      <Text
        style={styles.headerCongregation}
      >{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
    </View>
  );
};

export default WeekendMeetingHeader;
