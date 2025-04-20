import { atom } from 'jotai';
import { APIUserRequest } from '@definition/api';

export const isProcessingUserState = atom(false);

export const joinRequestsState = atom<APIUserRequest[]>([]);

export const joinRequestsCountState = atom((get) => {
  const requests = get(joinRequestsState);

  return requests.length;
});
