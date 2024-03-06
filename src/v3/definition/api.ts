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

export type AccountTypeState = 'vip' | 'pocket';
