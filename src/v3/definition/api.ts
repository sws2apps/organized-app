export type CongregationResponseType = {
  congNumber: string;
  congName: string;
  language: string;
  midweekMeetingTime: string;
  weekendMeetingTime: string;
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

export type ValidateUserResponseType = {
  cong_id: string;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  cong_name: string;
  cong_number: string;
  cong_role: string[];
  id: string;
  mfaEnabled: boolean;
  cong_circuit: { type: string; value: string }[];
  cong_location: { address: string; lat: number; lng: number };
  midweek_meeting: MeetingResponseType[];
  weekend_meeting: MeetingResponseType[];
};

export type UserLoginResponseType = {
  cong_encryption: string;
  firstname: { value: string; updatedAt: string };
  lastname: { value: string; updatedAt: string };
  mfa: 'not_enabled' | 'enabled';
  cong_name: string;
  cong_role: string[];
};
