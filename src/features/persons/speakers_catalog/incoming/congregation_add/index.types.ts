import { IncomingCongregationResponseType } from '@definition/api';

export type CongregationAddType = {
  open: boolean;
  onClose: VoidFunction;
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
