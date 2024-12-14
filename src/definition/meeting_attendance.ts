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
