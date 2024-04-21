export type DailyReportType = {
  report_uid: string;
  month: string;
  month_date: string;
  placements: number;
  videos: number;
  hours: number;
  duration_start: string;
  returnVisits: number;
  bibleStudies: [];
  comments: string;
  isDeleted: boolean;
  isSubmitted: boolean;
  isPending: boolean;
  isS4: boolean;
  isS21: boolean;
  changes: [];
};
