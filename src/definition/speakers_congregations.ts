import { IncomingCongregationResponseType } from './api';

export type SpeakersCongregationsType = {
  _deleted: { value: boolean; updatedAt: string };
  id?: string;
  cong_data: {
    cong_id: string;
    cong_number: { value: string; updatedAt: string };
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
    request_id: string;
  };
};

export type CongregationIncomingDetailsType =
  IncomingCongregationResponseType & {
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
