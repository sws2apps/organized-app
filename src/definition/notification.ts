import { APIUserRequest } from './api';

export type NotificationIconType =
  | 'standard'
  | 'talk'
  | 'reports'
  | 'join-requests';

export type NotificationDbRecordType = {
  id: number;
  updatedAt: string;
  title: string;
  desc: string;
  read?: boolean;
};

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
  icon: NotificationIconType;
  congs: CongregationSpeakerRequestType[];
  enableRead: boolean;
  read?: boolean;
};

export type UnverifiedReportNotificationType = {
  id: 'reports-unverified';
  title: string;
  description: string;
  date: string;
  icon: NotificationIconType;
  count: number;
  enableRead: boolean;
  read?: boolean;
};

export type JoinRequestNotificationType = {
  id: 'join-requests';
  title: string;
  description: string;
  date: string;
  icon: NotificationIconType;
  requests: APIUserRequest[];
  enableRead: boolean;
  read?: boolean;
};

export type StandardNotificationType = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: NotificationIconType;
  enableRead: boolean;
  read: boolean;
};

export type NotificationRecordType =
  | SpeakerNotificationType
  | UnverifiedReportNotificationType
  | JoinRequestNotificationType
  | StandardNotificationType;
