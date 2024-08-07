import { CongregationRequestType } from '@definition/api';

export type OutgoingSpeakersListActiveType = {
  congregations: CongregationRequestType[];
  onDelete: (congregation: CongregationRequestType) => void;
};
