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
  cong_circuit: string;
  cong_location: { address: string; lat: number; lng: number };
  midweek_meeting: { weekday: number; time: string };
  weekend_meeting: { weekday: number; time: string };
};

type MeetingResponseType = { type: string; weekday: number; time: string };

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
    cong_role: string[];
    id: string;
    mfaEnabled: boolean;
    cong_circuit: { type: string; value: string }[];
    cong_location: { address: string; lat: number; lng: number };
    midweek_meeting: MeetingResponseType[];
    weekend_meeting: MeetingResponseType[];
    cong_master_key: string;
    cong_access_code: string;
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
  midweek_meeting: { weekday: number; time: string };
  weekend_meeting: { weekday: number; time: string };
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
