type ReportType = {
  report_count: number;
  hours?: number;
  bible_studies: number;
};

export type BranchFieldServiceReportType = {
  id?: string;
  updateAt: string;
  month_date: string;
  active_publishers: number;
  average_weekend_meeting: number;
  publishers: ReportType;
  APs: ReportType;
  FRs: ReportType;
  isSubmitted: { value: boolean; updatedAt: string };
};
