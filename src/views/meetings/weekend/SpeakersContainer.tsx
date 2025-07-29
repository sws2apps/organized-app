import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { SpeakersContainerType } from './index.types';
import styles from './index.styles';
import { Week } from '@definition/week_type';
import IconSong from '@views/components/icons/IconSong';

const SpeakersContainer = ({ meetingData, lang }: SpeakersContainerType) => {
  const { t } = useAppTranslation();

  return (
    <>
      {/* 1st row: talk title & number */}
      <View style={styles.talkTitleContainer}>
        {/* 1st column: talk title & speaker */}
        <Text style={styles.talkTitle}>
          {meetingData.week_type === Week.SPECIAL_TALK
            ? `${meetingData.week_type_name}: `
            : ''}
          {meetingData.public_talk_title}
          <Text style={styles.talkNumber}>
            {'  '}
            {meetingData.public_talk_number}
          </Text>
        </Text>

        {meetingData.show_songs && Boolean(meetingData.opening_song) && (
          <View style={styles.openingSongContainer}>
            <IconSong color="#3B4CA3" />
            <Text style={styles.talkTitle}>
              {`${meetingData.opening_song}. `}
              <Text style={styles.openingSongTitle}>
                {meetingData.opening_song_title}
              </Text>
            </Text>
          </View>
        )}
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
