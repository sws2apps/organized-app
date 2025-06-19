import { Box } from '@mui/material';
import MeetingItem from './meeting_item';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import { ReactNode } from 'react';

export type FieldServiceMeetingsListProps = {
  meetings: FieldServiceMeetingFormattedType[];
  canEdit?: boolean;
  onEditMeeting?: (meetingUid: string) => void;
  editingMeetingUid?: string;
  formComponent?: ReactNode;
};

const FieldServiceMeetingsList = ({
  meetings,
  canEdit,
  onEditMeeting,
  editingMeetingUid,
  formComponent,
}: FieldServiceMeetingsListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {meetings.map((meeting) => {
        // If this meeting is being edited, render the form instead
        if (editingMeetingUid && meeting.uid === editingMeetingUid) {
          return <Box key={meeting.uid}>{formComponent}</Box>;
        }

        // Otherwise render the normal meeting item
        return (
          <MeetingItem
            key={meeting.uid}
            meeting={meeting}
            canEdit={canEdit}
            onEdit={() => onEditMeeting?.(meeting.uid)}
          />
        );
      })}
    </Box>
  );
};

export default FieldServiceMeetingsList;
