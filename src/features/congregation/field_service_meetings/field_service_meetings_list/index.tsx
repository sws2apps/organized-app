import { Box } from '@mui/material';
import MeetingItem from '../meeting_item';
import { FieldServiceMeetingsListProps } from './index.types';

const FieldServiceMeetingsList = ({
  meetings,
  canEditMeeting,
  onEditMeeting,
  editingMeetingUid,
  formComponent,
}: FieldServiceMeetingsListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {meetings.map((meeting) => {
        // The meeting being edited renders as the edit form instead of a card.
        if (editingMeetingUid && meeting.uid === editingMeetingUid) {
          return <Box key={meeting.uid}>{formComponent}</Box>;
        }

        return (
          <MeetingItem
            key={meeting.uid}
            meeting={meeting}
            canEdit={canEditMeeting ? canEditMeeting(meeting) : false}
            onEdit={() => onEditMeeting?.(meeting.uid)}
          />
        );
      })}
    </Box>
  );
};

export default FieldServiceMeetingsList;
