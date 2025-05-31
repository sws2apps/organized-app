export type MeetingStatsData = {
  count: number;
  total: number;
  average: number;
};

export type MonthData = {
  month: string;
  midweek: MeetingStatsData;
  weekend: MeetingStatsData;
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
