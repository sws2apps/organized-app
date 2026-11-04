import { FieldServiceMeetingType } from '@definition/field_service_meetings';
import { Table } from 'dexie';

export type FieldServiceMeetingsTable = {
  field_service_meetings: Table<FieldServiceMeetingType>;
};

export const fieldServiceMeetingsSchema = {
  field_service_meetings: '&meeting_uid, meeting_data',
};
