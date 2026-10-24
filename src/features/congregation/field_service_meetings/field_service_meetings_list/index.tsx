import { Box } from '@mui/material';
import MeetingItem from '@features/congregation/field_service_meetings/meeting_item';
import { FieldServiceMeetingsListProps } from '@features/congregation/field_service_meetings/field_service_meetings_list/index.types';
const FieldServiceMeetingsList = ({
  meetings,
  canEditMeeting,
  onEditMeeting,
}: FieldServiceMeetingsListProps) => (
  <Box
    sx={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}
  >
    {meetings.map((meeting) => (
      <MeetingItem
        key={meeting.uid}
        meeting={meeting}
        canEdit={canEditMeeting?.(meeting) ?? false}
        onEdit={() => onEditMeeting?.(meeting.uid)}
      />
    ))}
  </Box>
);
export default FieldServiceMeetingsList;
