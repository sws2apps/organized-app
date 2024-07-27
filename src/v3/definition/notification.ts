import { ReactElement } from 'react';

export type CongregationSpeakerRequestType = {
  cong_name: string;
  cong_number: string;
  country_code: string;
  request_id: string;
};

export type NotificationRecordType = {
  id: string;
  type: 'speakers-request';
  title: string;
  description: string;
  date: string;
  icon: ReactElement;
  options?: CongregationSpeakerRequestType[];
  enableRead?: boolean;
  read?: boolean;
};
