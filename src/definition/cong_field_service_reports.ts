export type CongFieldServiceReportType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    person_uid: string;
    shared_ministry: boolean;
    hours: {
      field_service: number;
      credit: {
        value: number;
        approved: number;
      };
    };
    submitted: string;
    late: boolean;
    bible_studies: number;
    comments: string;
    status: 'received' | 'confirmed';
  };
};
