import { ReactElement, ReactNode } from 'react';
import {
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';

export type FilterId = 'all' | 'my-group' | 'joint' | 'zoom';

export type MeetingItemProps = {
  meeting: FieldServiceMeetingType;
  canEdit?: boolean;
  onEdit?: () => void;
};

export type GroupOption = {
  id: string;
  label: string;
};

export type LocationOption = {
  value: FieldServiceMeetingLocation;
  label: string;
  icon: ReactElement;
};

export type MeetingFormProps = {
  meeting: FieldServiceMeetingType;
  mode: 'edit' | 'add';
  onClose: () => void;
  onSave: (meeting: FieldServiceMeetingType) => Promise<void> | void;
  onDelete?: (meeting: FieldServiceMeetingType) => Promise<void> | void;
};

export type FieldServiceMeetingsListProps = {
  meetings: FieldServiceMeetingFormattedType[];
  canEdit?: boolean;
  onEditMeeting?: (meetingUid: string) => void;
  editingMeetingUid?: string;
  formComponent?: ReactNode;
};
