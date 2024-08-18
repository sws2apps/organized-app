import { CongregationUserType } from '@definition/api';

export type DeleteCodeType = {
  open: boolean;
  onClose: VoidFunction;
  user: CongregationUserType;
};
