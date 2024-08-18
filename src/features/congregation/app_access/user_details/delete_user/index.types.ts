import { CongregationUserType } from '@definition/api';

export type DeleteUserType = {
  open: boolean;
  onClose: VoidFunction;
  user: CongregationUserType;
};
