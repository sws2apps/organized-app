import { ReactElement } from 'react';
import {
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';

/**
 * Type definitions for field service meetings feature
 */

// -------------------------------------------------------------------------
// Filter Types
// -------------------------------------------------------------------------

export type FilterId = 'all' | 'my-group' | 'joint' | 'zoom';

// -------------------------------------------------------------------------
// Meeting Item Types
// -------------------------------------------------------------------------

export type MeetingItemProps = {
  meeting: FieldServiceMeetingType;
  canEdit?: boolean;
  onEdit?: () => void;
};

// -------------------------------------------------------------------------
// Meeting Form Types
// -------------------------------------------------------------------------

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
};
