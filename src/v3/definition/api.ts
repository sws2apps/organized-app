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
  visitorid: string;
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
    cong_encryption: string;
  };
};

export type UserLoginResponseType = {
  cong_encryption: string;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  mfa: 'not_enabled' | 'enabled';
  cong_name: string;
  cong_role: string[];
};

export type GetUser2FAResponseType = {
  status: number;
  result: { message?: string; mfaEnabled?: boolean; qrCode?: string; secret?: string };
};

export type GetUserSessionsType = {
  status: number;
  result: { message?: string; sessions?: SessionResponseType[] };
};

export type ApprovedVisitingSpeakersAccessListType = {
  cong_id: string;
  cong_number: string;
  cong_name: string;
};

export type GetApprovedVisitingSpeakersAccessResponseType = {
  status: number;
  result: { message?: string; congregations: ApprovedVisitingSpeakersAccessListType[] };
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
