import { Table } from 'dexie';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

export type MeetingAttendanceTable = {
  meeting_attendance: Table<MeetingAttendanceType>;
};

export const meetingAttendanceSchema = {
  meeting_attendance: '&month_date, week_1, week_2, week_3, week_4, week_5',
};
