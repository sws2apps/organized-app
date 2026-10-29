import { Text, View } from '@react-pdf/renderer';
import { FieldServiceDayProps } from './index.types';
import styles from './index.styles';
import { FieldServiceMeetingLocation } from '@definition/field_service_meetings';
import {
  IconAtHome,
  IconConference,
  IconInTerritory,
  IconJwHome,
} from '@views/components/icons';

const locationIcons: Record<FieldServiceMeetingLocation, typeof IconAtHome> = {
  [FieldServiceMeetingLocation.Publisher]: IconAtHome,
  [FieldServiceMeetingLocation.KingdomHall]: IconJwHome,
  [FieldServiceMeetingLocation.Territory]: IconInTerritory,
  [FieldServiceMeetingLocation.Online]: IconConference,
};

const FieldServiceDay = ({ day, isLast }: FieldServiceDayProps) => {
  return (
    <View style={[styles.dayRow, isLast ? styles.dayRowLast : {}]}>
      <View style={[styles.dateCell, isLast ? styles.dateCellLast : {}]}>
        <Text style={styles.dateText}>{day.dateLabel}</Text>
      </View>

      <View style={styles.meetingsColumn}>
        {day.meetings.map((meeting, index) => {
          const LocationIcon = locationIcons[meeting.location] ?? IconAtHome;
          return (
            <View
              key={meeting.id}
              style={[
                styles.meetingRow,
                index === day.meetings.length - 1
                  ? {}
                  : styles.meetingRowDivider,
              ]}
            >
              <View style={styles.meetingDetails}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>{meeting.time}</Text>
                </View>

                <View style={styles.groupCell}>
                  <Text style={styles.cellText}>{meeting.group}</Text>
                  {meeting.note && (
                    <Text style={styles.noteText}>{meeting.note}</Text>
                  )}
                </View>

                <View style={styles.textCell}>
                  <View style={styles.locationContent}>
                    <View style={styles.locationIcon}>
                      <LocationIcon size={12} color="#616161" />
                    </View>
                    <View style={styles.locationText}>
                      <Text style={styles.cellText}>{meeting.address}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.textCell}>
                  <Text style={styles.cellText}>{meeting.conductor}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FieldServiceDay;
