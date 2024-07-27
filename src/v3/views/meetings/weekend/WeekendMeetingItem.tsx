import { useRecoilValue } from 'recoil';
import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { Week } from '@definition/week_type';
import {
  COFullnameState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import {
  CommonMeetingPartsType,
  CommonSpeechContainerType,
  MeetingRoleType,
  WeekendMeetingItemType,
} from './index.types';
import styles from './index.styles';

const MeetingRole = ({ role, name }: MeetingRoleType) => (
  <View style={styles.roleContainer}>
    <Text style={styles.meetingRole}>{role}:</Text>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const CommonMeetingParts = ({
  meetingData,
  noOpeningPrayer,
}: CommonMeetingPartsType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.meetingParts}>
      <View>
        <MeetingRole
          role={t('chairmanWeekendMeeting')}
          name={meetingData.chairman_name}
        />
        {!noOpeningPrayer && (
          <MeetingRole
            role={t('openingPrayerWeekendMeeting')}
            name={meetingData.opening_prayer_name}
          />
        )}
      </View>
      {meetingData.week_type === Week.NORMAL && (
        <>
          <View style={styles.lineHorizontal} />
          <View>
            <MeetingRole
              role={t('wtStudyReader')}
              name={meetingData.wtstudy_reader_name}
            />
          </View>
        </>
      )}
    </View>
  );
};

const CommonSpeechContainer = ({ meetingData }: CommonSpeechContainerType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.speechContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.speechTitle}>{meetingData.public_talk_title}</Text>
        <Text style={styles.speechNumber}>
          {meetingData.public_talk_number}
        </Text>
      </View>
      <View style={styles.speakerContainer}>
        <View style={styles.mainSpeaker}>
          <Text style={styles.speaker}>{meetingData.speaker_1_name}</Text>
          {meetingData.speaker_2_name?.length > 0 && (
            <Text style={styles.speaker}>{meetingData.speaker_2_name}</Text>
          )}
          {meetingData.speaker_cong_name?.length > 0 && (
            <Text style={styles.congregation}>
              {meetingData.speaker_cong_name}
            </Text>
          )}
        </View>
        {meetingData.substitute_speaker_name?.length > 0 ? (
          <View style={styles.substituteSpeaker}>
            <Text style={styles.substitute}>{t('substituteSpeaker')}:</Text>
            <Text style={styles.substituteName}>
              {meetingData.substitute_speaker_name}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const WeekendMeetingItem = ({
  meetingData,
  isLastItem,
}: WeekendMeetingItemType) => {
  const noOpeningPrayer = useRecoilValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const coName = useRecoilValue(COFullnameState);

  const { date_formatted, event_name, public_talk_title } = meetingData;

  return (
    <View
      style={[
        styles.itemContainer,
        isLastItem && { borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
      ]}
    >
      <View style={[styles.date, isLastItem && { borderBottomLeftRadius: 6 }]}>
        <Text style={styles.dateText}>{date_formatted}</Text>
      </View>
      {meetingData.week_type === Week.NORMAL && (
        <>
          <CommonMeetingParts
            meetingData={meetingData}
            noOpeningPrayer={noOpeningPrayer}
          />
          <View style={styles.lineVertical} />
          <CommonSpeechContainer meetingData={meetingData} />
        </>
      )}
      {meetingData.week_type === Week.CO_VISIT && (
        <>
          <CommonMeetingParts
            meetingData={meetingData}
            noOpeningPrayer={noOpeningPrayer}
          />
          <View style={styles.lineVertical} />
          <View style={styles.speechContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.speechTitle}>{public_talk_title}</Text>
            </View>
            <View style={styles.speakerContainer}>
              <View style={styles.mainSpeaker}>
                <Text style={styles.speaker}>{coName}</Text>
              </View>
            </View>
          </View>
        </>
      )}
      {meetingData.week_type !== Week.NORMAL &&
        meetingData.week_type !== Week.CO_VISIT && (
          <>
            <View style={styles.meetingParts} />
            <View style={styles.lineVertical} />
            <View style={styles.speechContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.speechTitle}>
                  {meetingData.week_type_name}
                </Text>
              </View>

              <View style={styles.speakerContainer}>
                <View style={styles.mainSpeaker}>
                  <Text style={styles.speaker}>{event_name}</Text>
                </View>
              </View>
            </View>
          </>
        )}
    </View>
  );
};

export default WeekendMeetingItem;
