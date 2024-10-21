import { ReactElement } from 'react';

export type CongregationSpeakerRequestType = {
  cong_name: string;
  cong_number: string;
  country_code: string;
  request_id: string;
};

export type SpeakerNotificationType = {
  id: 'speakers-request';
  title: string;
  description: string;
  date: string;
  icon: ReactElement;
  congs: CongregationSpeakerRequestType[];
  enableRead: boolean;
  read?: boolean;
};

export type UnverifiedReportNotificationType = {
  id: 'reports-unverified';
  title: string;
  description: string;
  date: string;
  icon: ReactElement;
  count: number;
  enableRead: boolean;
  read?: boolean;
};

export type StandardNotificationType = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: ReactElement;
  enableRead: boolean;
  read: boolean;
};

export type NotificationRecordType =
  | SpeakerNotificationType
  | UnverifiedReportNotificationType
  | StandardNotificationType;
