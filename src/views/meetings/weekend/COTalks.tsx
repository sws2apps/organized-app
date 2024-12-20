import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { COTalksType } from './index.types';
import styles from './index.styles';

const COTalks = ({ meetingData, lang }: COTalksType) => {
  const { t } = useAppTranslation();

  return (
    <>
      {/* 1st row: week type */}
      <Text style={styles.talkTitle}>{meetingData.week_type_name}</Text>

      {/* 2nd row: co name */}
      <Text style={styles.speaker}>{meetingData.co_name}</Text>

      {/* 3rd row: public talk */}
      {meetingData.public_talk_title && (
        <View style={styles.circuitOverseerTalkContainer}>
          <Text style={styles.labelDefault}>
            {t('tr_publicTalk', { lng: lang })}
          </Text>
          <Text style={styles.talkTitle}>{meetingData.public_talk_title}</Text>
        </View>
      )}

      {/* 4th row: service talk */}
      {meetingData.service_talk_title && (
        <View style={styles.circuitOverseerTalkContainer}>
          <Text style={styles.labelDefault}>
            {t('tr_serviceTalk', { lng: lang })}
          </Text>
          <Text style={styles.talkTitle}>{meetingData.service_talk_title}</Text>
        </View>
      )}
    </>
  );
};

export default COTalks;
