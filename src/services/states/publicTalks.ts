// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import {
  publicTalksSearchKeyState,
  publicTalksState,
} from '@states/public_talks';
import { PublicTalkType } from '@definition/public_talks';

export const setPublicTalksSearchKey = (value: string) => {
  store.set(publicTalksSearchKeyState, value);
};

export const publicTalksFind = (talk_number: number) => {
  const talks = store.get(publicTalksState);
  return talks.find((record) => record.talk_number === talk_number);
};

export const setPublicTalks = (value: PublicTalkType[]) => {
  store.set(publicTalksState, value);
};
