type WeeklyAttendance = {
  midweek: { present: number; online: number };
  weekend: { present: number; online: number };
};

export type MeetingAttendanceType = {
  id?: string;
  month_date: string;
  week_1: WeeklyAttendance;
  week_2: WeeklyAttendance;
  week_3: WeeklyAttendance;
  week_4: WeeklyAttendance;
  week_5: WeeklyAttendance;
};
