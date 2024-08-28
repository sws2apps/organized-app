export type BibleStudyReportType = {
  _deleted: boolean;
  person_uid: string;
  updatedAt: string;
};

export type UserFieldServiceDailyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    hours: number;
    hours_credits: number;
    duration_start: string;
    bible_studies: { value: number; records: BibleStudyReportType[] };
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
