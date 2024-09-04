type ReportType = {
  report_count: number;
  hours?: number;
  bible_studies: number;
};

export type BranchFieldServiceReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    publishers_active: number;
    weekend_meeting_average: number;
    publishers: ReportType;
    APs: ReportType;
    FRs: ReportType;
    submitted: boolean;
  };
};
