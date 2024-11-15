import { CongregationUserType } from '@definition/api';

export type UsersListType = {
  users: CongregationUserType[];
  isLoading?: boolean
};
