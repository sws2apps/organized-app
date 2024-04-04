import { useTranslation } from 'react-i18next';
import { Text, View } from '@react-pdf/renderer';
import { Setting } from '../../classes/Setting';
import styles from './styles';

const noOpeningPrayer = Setting.opening_prayer_WM_autoAssign;
const source_lang = Setting.source_lang;

const MeetingRole = ({ role, name }) => (
  <View style={styles.roleContainer}>
    <Text style={styles.meetingRole}>{role}:</Text>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const WeekendMeetingItem = ({ meetingData, isLastItem }) => {
  const { t } = useTranslation('source');

  const {
    weekend_meeting_date_formatted,
    chairman_WM_name,
    opening_prayerWM_name,
    public_talk_title,
    public_talk_number,
    wtstudy_reader_name,
    week_type,
    event_name,
    w_talk_title_override,
    is_custom_talk,
    w_co_talk_title,
    speaker_1_name,
    speaker_2_name,
    speaker_cong_name,
    substitute_speaker_name,
  } = meetingData;

  const publicTalkTitle = is_custom_talk ? w_talk_title_override : public_talk_title;

  const weekTypeName = () => {
    let result = '';

    if (week_type === 3) result = t('conventionWeek');
    if (week_type === 4) result = t('assemblyWeek');

    return result;
  };

  const commonMeetingParts = (
    <View style={styles.meetingParts}>
      <View>
        <MeetingRole role={t('chairmanWeekendMeeting', { lng: source_lang })} name={chairman_WM_name} />
        {!noOpeningPrayer && (
          <MeetingRole role={t('openingPrayerWeekendMeeting', { lng: source_lang })} name={opening_prayerWM_name} />
        )}
      </View>
      {week_type === 1 && (
        <>
          <View style={styles.lineHorizontal} />
          <View>
            <MeetingRole role={t('wtStudyReader', { lng: source_lang })} name={wtstudy_reader_name} />
          </View>
        </>
      )}
    </View>
  );

  const commonSpeechContainer = (
    <View style={styles.speechContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.speechTitle}>{publicTalkTitle}</Text>
        <Text style={styles.speechNumber}>{public_talk_number}</Text>
      </View>
      <View style={styles.speakerContainer}>
        <View style={styles.mainSpeaker}>
          <Text style={styles.speaker}>{speaker_1_name}</Text>
          {speaker_2_name && speaker_2_name.length > 0 ? <Text style={styles.speaker}>{speaker_2_name}</Text> : null}
          {speaker_cong_name && speaker_cong_name.length > 0 ? (
            <Text style={styles.congregation}>{speaker_cong_name}</Text>
          ) : null}
        </View>
        {substitute_speaker_name && substitute_speaker_name.length > 0 ? (
          <View style={styles.substituteSpeaker}>
            <Text style={styles.substitute}>{t('substituteSpeaker', { lng: source_lang })}:</Text>
            <Text style={styles.substituteName}>{substitute_speaker_name}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  let content;

  if (week_type === 1) {
    content = (
      <>
        {commonMeetingParts}
        <View style={styles.lineVertical} />
        {commonSpeechContainer}
      </>
    );
  } else if (week_type === 2) {
    content = (
      <>
        {commonMeetingParts}
        <View style={styles.lineVertical} />
        <View style={styles.speechContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.speechTitle}>{w_co_talk_title}</Text>
          </View>
          <View style={styles.speakerContainer}>
            <View style={styles.mainSpeaker}>
              <Text style={styles.speaker}>{Setting.co_name}</Text>
            </View>
          </View>
        </View>
      </>
    );
  } else {
    content = (
      <>
        <View style={styles.meetingParts}></View>
        <View style={styles.lineVertical} />
        <View style={styles.speechContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.speechTitle}>{weekTypeName()}</Text>
          </View>

          <View style={styles.speakerContainer}>
            <View style={styles.mainSpeaker}>
              <Text style={styles.speaker}>{event_name}</Text>
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={[styles.itemContainer, isLastItem && { borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
      <View style={[styles.date, isLastItem && { borderBottomLeftRadius: 6 }]}>
        <Text style={styles.dateText}>{weekend_meeting_date_formatted}</Text>
      </View>
      {content}
    </View>
  );
};

export default WeekendMeetingItem;
