import { AppRoleType } from './app';

export type CongregationResponseType = {
  address: string;
  circuit: string;
  congNumber: string;
  congName: string;
  location: { lat: number; lng: number };
  midweekMeetingTime: { time: string; weekday: number };
  weekendMeetingTime: { time: string; weekday: number };
};

export type CountryResponseType = {
  countryCode: string;
  countryName: string;
};

export type SessionResponseType = {
  identifier: string;
  isSelf: boolean;
  ip: string;
  country_name: string;
  device: {
    browserName: string;
    os: string;
    isMobile: boolean;
  };
  last_seen: number;
};

export type CongregationCreateResponseType = {
  cong_id: string;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  country_code: string;
  cong_name: string;
  cong_number: string;
  cong_role: string[];
  id: string;
  cong_circuit: { type: string; value: string; updatedAt: string }[];
  cong_location: {
    address: string;
    lat: number;
    lng: number;
    updatedAt: string;
  };
  midweek_meeting: MeetingResponseType[];
  weekend_meeting: MeetingResponseType[];
};

type MeetingResponseType = {
  type: string;
  weekday: { value: number; updatedAt: string };
  time: { value: string; updatedAt: string };
};

export type ValidateMeResponseType = {
  status: number;
  result: {
    message: string;
    cong_id: string;
    firstname: { value: string; updatedAt: string };
    lastname: { value: string; updatedAt: string };
    country_code: string;
    cong_name: string;
    cong_number: string;
    cong_role: AppRoleType[];
    id: string;
    mfaEnabled: boolean;
    cong_circuit: { type: string; value: string; updatedAt: string }[];
    cong_location: {
      address: string;
      lat: number;
      lng: number;
      updatedAt: string;
    };
    midweek_meeting: MeetingResponseType[];
    weekend_meeting: MeetingResponseType[];
    cong_master_key: string;
    cong_access_code: string;
    user_local_uid: string;
    user_delegates: string[];
  };
};

export type UserLoginResponseType = {
  cong_master_key: string;
  cong_password: string;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  mfa: 'not_enabled' | 'enabled';
  cong_name: string;
  cong_role: string[];
};

export type User2FAResponseType = {
  status: number;
  result: {
    message?: string;
    mfaEnabled?: boolean;
    qrCode?: string;
    secret?: string;
  };
};

export type UserSessionsResponseType = {
  status: number;
  result: { message?: string; sessions?: SessionResponseType[] };
};

export type VisitingSpeakersAccessResponseType = {
  status: number;
  result: {
    message?: string;
    congregations: CongregationRequestType[];
    speakers_key?: string;
    cong_master_key?: string;
  };
};

export type IncomingCongregationResponseType = {
  cong_id?: string;
  cong_name: string;
  cong_number: string;
  country_code: string;
  cong_circuit: string;
  cong_location: { address: string; lat: number; lng: number };
  midweek_meeting: {
    weekday: { value: number; updatedAt: string };
    time: { value: string; updatedAt: string };
  };
  weekend_meeting: {
    weekday: { value: number; updatedAt: string };
    time: { value: string; updatedAt: string };
  };
};

export type CongregationRequestType = {
  cong_id: string;
  updatedAt: string;
  cong_number: string;
  cong_name: string;
  country_code: string;
  request_id: string;
};

export type VisitingSpeakerEncryptedType = {
  person_uid: string;
  _deleted: string;
  speaker_data: {
    cong_id: string;
    person_firstname: string;
    person_lastname: string;
    person_display_name: string;
    person_notes: string;
    person_email: string;
    person_phone: string;
    elder: string;
    ministerial_servant: string;
    talks: string;
  };
};

export type RemoteCongregationType = {
  cong_id: string;
  status: 'pending' | 'approved' | 'disapproved';
  updatedAt: string;
  key: string;
  list: VisitingSpeakerEncryptedType[];
  cong_name?: string;
  cong_number?: string;
  country_code?: string;
  request_id: string;
};

export type CongregationUpdatesResponseType = {
  status: number;
  result: {
    message?: string;
    cong_master_key?: string;
    cong_access_code?: string;
    speakers_key?: string;
    pending_speakers_requests?: CongregationRequestType[];
    remote_congregations?: RemoteCongregationType[];
    rejected_requests?: RemoteCongregationType[];
  };
};

export type APIResponseMessageString = {
  status: number;
  message: string;
};

export type UserGlobalRoleType = 'vip' | 'pocket' | 'admin';

export type UserSession = {
  mfaVerified?: boolean;
  sws_last_seen: string;
  visitor_details: {
    browser: string;
    ip: string;
    ipLocation: {
      city: string;
      continent_code: string;
      country_code: string;
      country_name: string;
      timezone: string;
    };
    isMobile: boolean;
    os: string;
  };
  visitorid: string;
  identifier: string;
};

export type CongregationUserType = {
  id: string;
  user_email: string;
  user_local_uid: string;
  pocket_oCode: string;
  cong_id: string;
  cong_country: string;
  cong_name: string;
  cong_number: string;
  cong_role: AppRoleType[];
  mfaEnabled: boolean;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  global_role: UserGlobalRoleType;
  sessions?: SessionResponseType[];
  last_seen: string;
  auth_uid: string;
  secret: string;
  pocket_invitation_code: string;
  user_delegates: string[];
};

export type APICongregationUserType = {
  status: number;
  users: CongregationUserType[];
};
