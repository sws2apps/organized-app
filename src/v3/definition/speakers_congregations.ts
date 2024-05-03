import { IncomingCongregationResponseType } from './api';

export type SpeakersCongregationsType = {
  _deleted: string | null;
  cong_number: string;
  cong_id: string;
  cong_name: { value: string; updatedAt: string };
  cong_circuit: { value: string; updatedAt: string };
  cong_location: {
    address: { value: string; updatedAt: string };
    lat: number;
    lng: number;
  };
  midweek_meeting: {
    weekday: { value: number; updatedAt: string };
    time: { value: string; updatedAt: string };
  };
  weekend_meeting: {
    weekday: { value: number; updatedAt: string };
    time: { value: string; updatedAt: string };
  };
  public_talk_coordinator: {
    name: { value: string; updatedAt: string };
    email: { value: string; updatedAt: string };
    phone: { value: string; updatedAt: string };
  };
  coordinator: {
    name: { value: string; updatedAt: string };
    email: { value: string; updatedAt: string };
    phone: { value: string; updatedAt: string };
  };
  request_status: 'pending' | 'disapproved' | 'approved';
  notification_dismissed: { value: boolean; updatedAt: string };
};

export type CongregationIncomingDetailsType = IncomingCongregationResponseType & {
  public_talk_coordinator: {
    name: string;
    email: string;
    phone: string;
  };
  coordinator: {
    name: string;
    email: string;
    phone: string;
  };
};
