export type TimerState = 'started' | 'not_started' | 'paused';

export type TimerRecordType = {
  state: TimerState;
  value: number;
  start: number;
};

export type UserFieldServiceDailyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    hours: {
      field_service: string;
      credit: string;
    };
    timer: TimerRecordType;
    bible_studies: { value: number; records: string[] };
    comments: string;
    record_type: 'daily';
  };
};

export type UserFieldServiceMonthlyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    shared_ministry: boolean;
    hours: {
      field_service: number;
      credit: {
        value: number;
        approved: number;
      };
    };
    bible_studies: number;
    comments: string;
    record_type: 'monthly';
    status: 'pending' | 'submitted' | 'confirmed';
  };
};

export type UserFieldServiceReportType =
  | UserFieldServiceDailyReportType
  | UserFieldServiceMonthlyReportType;
