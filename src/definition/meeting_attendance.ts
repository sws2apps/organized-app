export type AttendanceCongregation = {
  present: number;
  online: number;
  present_deaf?: number;
  online_deaf?: number;
  type: string;
  updatedAt: string;
};

export type AttendanceRecordField =
  | 'present'
  | 'online'
  | 'present_deaf'
  | 'online_deaf';

export type AttendanceValues = Partial<Record<AttendanceRecordField, string>>;

export type WeeklyAttendance = {
  midweek: AttendanceCongregation[];
  weekend: AttendanceCongregation[];
};

export type MeetingAttendanceType = {
  _deleted: { value: boolean; updatedAt: string };
  month_date: string;
  week_1: WeeklyAttendance;
  week_2: WeeklyAttendance;
  week_3: WeeklyAttendance;
  week_4: WeeklyAttendance;
  week_5: WeeklyAttendance;
};

export type MeetingAttendanceStats = {
  count: number;
  total: number;
  average: number;
  average_online: number;
  total_deaf: number;
  average_deaf: number;
};

export type MeetingAttendanceExport = {
  lang: string;
  locale: string;
  data: {
    name: string;
    columns: string[];
    midweek_meeting: {
      month: string;
      table_1: {
        count: string | number;
        total: string | number;
        average: string | number;
      };
      table_2: {
        count: string | number;
        total: string | number;
        average: string | number;
      };
    }[];
    midweek_average: number[];
    weekend_meeting: {
      month: string;
      table_1: {
        count: string | number;
        total: string | number;
        average: string | number;
      };
      table_2: {
        count: string | number;
        total: string | number;
        average: string | number;
      };
    }[];
    weekend_average: number[];
  }[];
};
