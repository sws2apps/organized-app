import { Text, View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { WeekDataType } from './index.types';
import COTalks from './COTalks';
import EventData from './EventData';
import MeetingPart from './MeetingPart';
import SpeakersContainer from './SpeakersContainer';
import styles from './index.styles';

const WeekData = ({ isLast, meetingData }: WeekDataType) => {
  return (
    <View
      style={[
        styles.weekContainer,
        isLast && {
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px',
        },
      ]}
    >
      {/* 1st column: date */}
      <View
        style={[
          styles.dateContainer,
          isLast && { borderBottomLeftRadius: '6px' },
        ]}
      >
        <Text style={styles.dateText}>{meetingData.date_formatted}</Text>
      </View>

      {/* 2nd column: opening & WT study & closing prayer */}
      <View style={styles.meetingPartSection}>
        {(meetingData.week_type === Week.NORMAL ||
          meetingData.week_type === Week.CO_VISIT) && (
          <MeetingPart meetingData={meetingData} />
        )}
      </View>

      {/* Verical separator */}
      <View style={styles.lineVertical} />

      {/* 3rd column: talks */}
      <View style={styles.talkContainer}>
        {meetingData.week_type === Week.NORMAL && (
          <SpeakersContainer meetingData={meetingData} />
        )}

        {meetingData.week_type === Week.CO_VISIT && (
          <COTalks meetingData={meetingData} />
        )}

        {meetingData.week_type !== Week.NORMAL &&
          meetingData.week_type !== Week.CO_VISIT && (
            <EventData meetingData={meetingData} />
          )}
      </View>
    </View>
  );
};

export default WeekData;
