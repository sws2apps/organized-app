import { MeetingAttendanceStats } from '@definition/meeting_attendance';

export type MonthData = {
  month: string;
  midweek: MeetingAttendanceStats;
  weekend: MeetingAttendanceStats;
};

export type YearlyData = {
  year: string;
  months: MonthData[];
};

export type AttendanceExport = {
  category: string;
  name: string;
  data: YearlyData[];
};

export type ColumnSource = {
  label: string;
  months: MonthData[];
  deaf?: boolean;
};
