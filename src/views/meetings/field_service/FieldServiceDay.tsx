import { Link, Text, View } from '@react-pdf/renderer';
import { FieldServiceDayProps } from './index.types';
import styles from './index.styles';

const FieldServiceDay = ({ day, isLast }: FieldServiceDayProps) => {
  return (
    <View style={[styles.dayRow, isLast ? styles.dayRowLast : {}]}>
      <View style={[styles.dateCell, isLast ? styles.dateCellLast : {}]}>
        <Text style={styles.dateText}>{day.dateLabel}</Text>
      </View>

      <View style={styles.meetingsColumn}>
        {day.meetings.map((meeting, index) => (
          <View
            key={meeting.id}
            style={[
              styles.meetingRow,
              index === day.meetings.length - 1 ? {} : styles.meetingRowDivider,
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
                {meeting.addressUrl ? (
                  <Link
                    src={meeting.addressUrl}
                    style={[styles.cellText, styles.linkText]}
                  >
                    {meeting.address}
                  </Link>
                ) : (
                  <Text style={styles.cellText}>{meeting.address}</Text>
                )}
              </View>

              <View style={styles.textCell}>
                <Text style={styles.cellText}>{meeting.conductor}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FieldServiceDay;
