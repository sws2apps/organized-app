import { atom } from 'recoil';
import { CongregationUserType } from '@definition/api';

export const currentCongregationUserState = atom<CongregationUserType>({
  key: 'currentCongregationUser',
  default: undefined,
});

export const isProcessingUserState = atom({
  key: 'isProcessingUser',
  default: false,
});
