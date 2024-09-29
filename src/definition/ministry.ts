export type APFormType = {
  months: string[];
  continuous: boolean;
  date: Date;
  name: string;
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
};
