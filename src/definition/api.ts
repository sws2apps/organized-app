import { AppRoleType } from './app';
import { APRecordType, IncomingReport } from './ministry';

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
  last_seen: string;
};

export type CongregationCreateResponseType = {
  user_id: string;
  cong_id: string;
  firstname: string;
  lastname: string;
  cong_settings: {
    cong_circuit: { type: string; value: string; updatedAt: string }[];
    cong_discoverable: { value: boolean; updatedAt: string };
    cong_location: {
      address: string;
      lat: number;
      lng: number;
      updatedAt: string;
    };
    cong_name: string;
    cong_new: boolean;
    cong_number: string;
    country_code: string;
    midweek_meeting: MeetingResponseType[];
    weekend_meeting: MeetingResponseType[];
  };
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
    country_code: string;
    cong_name: string;
    cong_number: string;
    cong_role: AppRoleType[];
    id: string;
    cong_master_key: string;
    cong_access_code: string;
    mfa: boolean;
  };
};

export type UserLoginResponseType = {
  message?: string;
  code?: string;
  id: string;
  app_settings: {
    user_settings: {
      firstname: { value: string; updatedAt: string };
      lastname: { value: string; updatedAt: string };
      role: UserGlobalRoleType;
      mfa: 'not_enabled' | 'enabled';
      user_local_uid?: string;
      cong_role?: AppRoleType[];
      user_members_delegate?: string[];
    };
    cong_settings?: {
      id: string;
      country_code: string;
      cong_circuit: { type: string; value: string; updatedAt: string }[];
      cong_name: string;
      cong_number: string;
      cong_master_key: string;
      cong_access_code: string;
      cong_location: {
        address: string;
        lat: number;
        lng: number;
        updatedAt: string;
      };
      midweek_meeting: MeetingResponseType[];
      weekend_meeting: MeetingResponseType[];
    };
  };
};

export type User2FAResponseType = {
  status: number;
  result: {
    message?: string;
    mfaEnabled?: boolean;
    qrCode?: string;
    secret?: string;
    MFA_CODE?: string;
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
    weekday: number;
    time: string;
  };
  weekend_meeting: {
    weekday: number;
    time: string;
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
    applications?: APRecordType[];
    incoming_reports?: IncomingReport[];
    join_requests: APIUserRequest[];
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
  profile: {
    global_role: UserGlobalRoleType;
    cong_role: AppRoleType[];
    firstname: { value: string; updatedAt: string };
    lastname: { value: string; updatedAt: string };
    user_local_uid: string;
    user_members_delegate: string[];
    pocket_invitation_code?: string;
    createdAt?: string;
  };
  sessions?: SessionResponseType[];
};

export type APICongregationUserType = {
  status: number;
  users: CongregationUserType[];
};

export type APFormOutgoing = {
  continuous: string;
  months: string;
  submitted: string;
};

export type APFormIncoming = {
  continuous: string;
  months: string;
  submitted: string;
};

export type APIUserRequest = {
  user: string;
  request_date: string;
  firstname: string;
  lastname: string;
};
