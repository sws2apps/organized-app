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
      field_service: { daily: string; monthly: string };
      credit: { daily: string; monthly: string };
    };
    bible_studies: { daily: number; monthly: number; records: string[] };
    comments: string;
    record_type: 'monthly';
    status: 'pending' | 'submitted' | 'confirmed';
    person_uid?: string;
  };
};

export type UserFieldServiceReportType =
  | UserFieldServiceDailyReportType
  | UserFieldServiceMonthlyReportType;
