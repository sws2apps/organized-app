import { Box } from '@mui/material';
import DayAgenda from '@components/day_agenda';
import MeetingItem from '@features/congregation/field_service_meetings/meeting_item';
import { FieldServiceMeetingsListProps } from '@features/congregation/field_service_meetings/field_service_meetings_list/index.types';
import useFieldServiceMeetingsList from '@features/congregation/field_service_meetings/field_service_meetings_list/useFieldServiceMeetingsList';
import { formatLongDateWithShortVars } from '@utils/date';

const FieldServiceMeetingsList = ({
  meetings,
  canEditMeeting,
  onEditMeeting,
}: FieldServiceMeetingsListProps) => {
  const { days } = useFieldServiceMeetingsList(meetings);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: 0,
      }}
    >
      {days.map((day) => (
        <DayAgenda
          key={day.date}
          title={formatLongDateWithShortVars(day.date, false)}
          slots={day.slots.map((slot) => ({
            key: slot.key,
            time: slot.time,
            dateTime: `${day.date.replaceAll('/', '-')}T${slot.key}`,
            content: (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minWidth: 0,
                  '& > * + *': {
                    borderTop: '1px solid var(--accent-200)',
                    paddingTop: '12px',
                  },
                }}
              >
                {slot.meetings.map((meeting) => (
                  <MeetingItem
                    key={meeting.uid}
                    meeting={meeting}
                    canEdit={canEditMeeting?.(meeting) ?? false}
                    onEdit={() => onEditMeeting?.(meeting.uid)}
                  />
                ))}
              </Box>
            ),
          }))}
        />
      ))}
    </Box>
  );
};

export default FieldServiceMeetingsList;
