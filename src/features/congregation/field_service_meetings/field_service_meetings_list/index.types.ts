import { ReactNode } from 'react';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';

export type FieldServiceMeetingsListProps = {
  meetings: FieldServiceMeetingFormattedType[];
  canEditMeeting?: (meeting: FieldServiceMeetingFormattedType) => boolean;
  onEditMeeting?: (meetingUid: string) => void;
  editingMeetingUid?: string;
  formComponent?: ReactNode;
};
