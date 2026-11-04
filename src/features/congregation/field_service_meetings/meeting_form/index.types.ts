import { ReactElement } from 'react';
import {
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';

export type MeetingFormProps = {
  meeting: FieldServiceMeetingType;
  mode: 'edit' | 'add';
  onClose: () => void;
  onSave: (meeting: FieldServiceMeetingType) => Promise<void> | void;
  onDelete?: (meeting: FieldServiceMeetingType) => Promise<void> | void;
};

export type GroupOption = {
  id: string;
  label: string;
};

// id holds the person_uid; label is the resolved display name
export type ConductorOption = {
  id: string;
  label: string;
};

export type LocationOption = {
  value: FieldServiceMeetingLocation;
  label: string;
  icon: ReactElement;
};
