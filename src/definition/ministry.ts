export type APFormType = {
  months: string[];
  continuous: boolean;
  date: Date;
  name: string;
  coordinator?: 'waiting' | 'approved' | 'rejected';
  secretary?: 'waiting' | 'approved' | 'rejected';
  service?: 'waiting' | 'approved' | 'rejected';
};

export type APRecordType = {
  continuous: boolean;
  expired: string;
  months: string[];
  status?: string;
  notified?: boolean;
  submitted: string;
  updatedAt: string;
  person_uid: string;
  request_id: string;
  coordinator?: 'waiting' | 'approved' | 'rejected';
  secretary?: 'waiting' | 'approved' | 'rejected';
  service?: 'waiting' | 'approved' | 'rejected';
};

export type IncomingReport = {
  person_uid: string;
  bible_studies: number;
  comments: string;
  hours: number;
  hours_credits: number;
  report_month: string;
  shared_ministry: boolean;
  updatedAt: string;
  _deleted: boolean;
};
