import { atom, selector } from 'recoil';
import { APIUserRequest } from '@definition/api';

export const isProcessingUserState = atom({
  key: 'isProcessingUser',
  default: false,
});

export const joinRequestsState = atom<APIUserRequest[]>({
  key: 'joinRequests',
  default: [],
});

export const joinRequestsCountState = selector({
  key: 'joinRequestsCount',
  get: ({ get }) => {
    const requests = get(joinRequestsState);

    return requests.length;
  },
});
