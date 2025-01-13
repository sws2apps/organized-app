export type AttendanceCongregation = {
  present: number;
  online: number;
  type: string;
  updatedAt: string;
};

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

export type MeetingAttendanceExport = {
  lang: string;
  locale: string;
  years: string[];
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
};
