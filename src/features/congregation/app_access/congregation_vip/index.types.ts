import { CongregationUserType } from '@definition/api';

export type CongregationVIPType = {
  admins: CongregationUserType[];
  brothers: CongregationUserType[];
  isLoading: boolean;
};
