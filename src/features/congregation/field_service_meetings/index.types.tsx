import { ReactElement } from 'react';
import { FieldServiceMeetingLocation } from '@definition/field_service_meetings';

/**
 * Type definitions for field service meetings feature
 */

// -------------------------------------------------------------------------
// Filter Types
// -------------------------------------------------------------------------

export type FilterId = 'all' | 'my-group' | 'joint' | 'online';

// -------------------------------------------------------------------------
// Meeting Form Types
// -------------------------------------------------------------------------

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
