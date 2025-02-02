export type DelegatedFieldServiceReportType = {
  report_id: string;
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
    status: 'pending' | 'submitted' | 'confirmed';
    person_uid: string;
    report_date: string;
  };
};
