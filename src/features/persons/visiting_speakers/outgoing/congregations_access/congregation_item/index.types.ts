import { CongregationRequestType } from '@definition/api';

export type CongregationItemType = {
  congregation: CongregationRequestType;
  onDelete: (congregation: CongregationRequestType) => void;
};
