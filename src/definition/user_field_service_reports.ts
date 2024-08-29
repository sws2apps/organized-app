export type UserFieldServiceDailyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    hours: string;
    hours_credits: string;
    duration_start: string;
    bible_studies: { value: number; records: string[] };
    record_type: 'daily';
  };
};

export type UserFieldServiceMonthlyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    shared_ministry: boolean;
    hours: number;
    hours_credits: number;
    bible_studies: number;
    comments: string;
    record_type: 'monthly';
  };
};

export type UserFieldServiceReportType =
  | UserFieldServiceDailyReportType
  | UserFieldServiceMonthlyReportType;
