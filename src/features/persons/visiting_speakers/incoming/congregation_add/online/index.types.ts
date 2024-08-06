import { IncomingCongregationResponseType } from '@definition/api';

export type CongregationOnlineAddType = {
  onCongregationChange: (value: IncomingCongregationResponseType) => void;
};
