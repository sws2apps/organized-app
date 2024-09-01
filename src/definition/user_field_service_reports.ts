export type PioneerEventType = 'language_class' | 'ske' | 'pioneer_school';

export type UserFieldServiceDailyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    hours: string;
    approved_assignments: string;
    duration_start: string;
    bible_studies: { value: number; records: string[] };
    record_type: 'daily';
  };
};

export type PioneerMonthlyEventReportType = {
  event: PioneerEventType;
  value: number;
};

export type UserFieldServiceMonthlyReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    shared_ministry: boolean;
    hours: number;
    hours_credits: {
      approved_assignments: { total: number; credit: number };
      events: PioneerMonthlyEventReportType[];
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
