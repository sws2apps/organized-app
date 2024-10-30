import { IncomingCongregationResponseType } from '@definition/api';

export type CongregationOfflineAddType = {
  onCongregationChange: (value: IncomingCongregationResponseType) => void;
};
