import { useRecoilValue } from 'recoil';
import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { congNameState, congNumberState } from '@states/settings';
import styles from './index.styles';

const S140Header = () => {
  const { t } = useAppTranslation();

  const cong_name = useRecoilValue(congNameState);
  const cong_number = useRecoilValue(congNumberState);

  return (
    <View style={styles.header} fixed>
      <Text>{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
      <Text style={styles.headerMidweekMeeting}>
        {t('midweekMeetingPrint')}
      </Text>
    </View>
  );
};

export default S140Header;
