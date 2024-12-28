import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { SpeakersContainerType } from './index.types';
import styles from './index.styles';

const SpeakersContainer = ({ meetingData, lang }: SpeakersContainerType) => {
  const { t } = useAppTranslation();

  return (
    <>
      {/* 1st row: talk title & number */}
      <View style={styles.talkTitleContainer}>
        {/* 1st column: talk title & speaker */}
        <Text style={styles.talkTitle}>{meetingData.public_talk_title}</Text>

        {/* 2nd column: talk number */}
        <Text style={styles.talkNumber}>{meetingData.public_talk_number}</Text>
      </View>

      {/* 2nd row: speakers & substitute */}
      <View style={styles.speakerContainer}>
        {/* 1st column: speakers */}
        <View>
          <Text style={styles.speaker}>{meetingData.speaker_1_name}</Text>
          {meetingData.speaker_2_name?.length > 0 && (
            <Text style={styles.speaker}>{meetingData.speaker_2_name}</Text>
          )}
          {meetingData.speaker_cong_name && (
            <Text style={styles.speakerCongregation}>
              {meetingData.speaker_cong_name}
            </Text>
          )}
        </View>

        {/* 2nd column: substitute */}
        {meetingData.substitute_speaker_name && (
          <View style={styles.substituteSpeakerContainer}>
            <Text style={styles.labelDefault}>
              {t('tr_substituteSpeaker', { lng: lang })}:
            </Text>
            <Text style={styles.substituteName}>
              {meetingData.substitute_speaker_name}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default SpeakersContainer;
