export type PersonFixedFilterOption =
  | 'active'
  | 'inactive'
  | 'baptized'
  | 'unbaptized'
  | 'AP'
  | 'FR'
  | 'not_submitted'
  | 'appointed';

export type PersonFilterOption =
  | PersonFixedFilterOption
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

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
    bible_studies: number;
    comments: string;
    late: {
      value: boolean;
      submitted: string;
    };
    status: 'received' | 'confirmed';
  };
};
