export type MeetingAttendanceType = {
  id?: string;
  month_date: string;
  week_1: {
    midweek: { present: number; online: number };
    weekend: { present: number; online: number };
  };
  week_2: {
    midweek: { present: number; online: number };
    weekend: { present: number; online: number };
  };
  week_3: {
    midweek: { present: number; online: number };
    weekend: { present: number; online: number };
  };
  week_4: {
    midweek: { present: number; online: number };
    weekend: { present: number; online: number };
  };
  week_5: {
    midweek: { present: number; online: number };
    weekend: { present: number; online: number };
  };
};
