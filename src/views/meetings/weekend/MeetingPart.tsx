import { Text, View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { MeetingPartType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

const MeetingPart = ({ meetingData }: MeetingPartType) => {
  const { t } = useAppTranslation();

  return (
    <>
      <View style={styles.meetingPartSectionRow}>
        {/* Chairman */}
        <View style={styles.meetingPartContainer}>
          <Text style={styles.meetingPartLabel}>{t('tr_chairman')}:</Text>
          <Text style={styles.meetingPartName}>
            {meetingData.chairman_name}
          </Text>
        </View>

        {/* Opening Prayer */}
        {meetingData.opening_prayer_name && (
          <View style={styles.meetingPartContainer}>
            <Text style={styles.meetingPartLabel}>
              {t('tr_openingPrayerWeekendMeeting')}:
            </Text>
            <Text style={styles.meetingPartName}>
              {meetingData.opening_prayer_name}
            </Text>
          </View>
        )}
      </View>

      {((meetingData.week_type === Week.NORMAL &&
        meetingData.wtstudy_reader_name) ||
        (meetingData.week_type === Week.CO_VISIT &&
          meetingData.wtstudy_conductor_name)) && (
        <>
          {/* Horizontal separator */}
          <View style={styles.lineHorizontal} />

          {/* WT Study conductor */}
          {meetingData.wtstudy_conductor_name && (
            <View style={styles.meetingPartContainer}>
              <Text style={styles.meetingPartLabel}>
                {t('tr_wtStudyConductor')}:
              </Text>
              <Text style={styles.meetingPartName}>
                {meetingData.wtstudy_conductor_name}
              </Text>
            </View>
          )}

          {/* WT Study reader */}
          {meetingData.wtstudy_reader_name && (
            <View style={styles.meetingPartContainer}>
              <Text style={styles.meetingPartLabel}>
                {meetingData.wtstudy_conductor_name
                  ? t('tr_reader')
                  : t('tr_wtStudyReader')}
                :
              </Text>
              <Text style={styles.meetingPartName}>
                {meetingData.wtstudy_reader_name}
              </Text>
            </View>
          )}
        </>
      )}

      {meetingData.concluding_prayer_name && (
        <>
          {/* Horizontal separator */}
          <View style={styles.lineHorizontal} />

          {/* Closing prayer */}
          <View style={styles.meetingPartContainer}>
            <Text style={styles.meetingPartLabel}>
              {t('tr_closingPrayerWeekendMeeting')}:
            </Text>
            <Text style={styles.meetingPartName}>
              {meetingData.concluding_prayer_name}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export default MeetingPart;
