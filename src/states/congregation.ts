import { atom } from 'recoil';
import { CongregationUserType } from '@definition/api';

export const currentCongregationUserState = atom<CongregationUserType>({
  key: 'currentCongregationUser',
  default: undefined,
});
