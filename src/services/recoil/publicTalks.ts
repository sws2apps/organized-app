// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import {
  publicTalksSearchKeyState,
  publicTalksState,
} from '@states/public_talks';
import { PublicTalkType } from '@definition/public_talks';

export const setPublicTalksSearchKey = async (value: string) => {
  await promiseSetRecoil(publicTalksSearchKeyState, value);
};

export const publicTalksFind = async (talk_number: number) => {
  const talks: PublicTalkType[] = await promiseGetRecoil(publicTalksState);
  return talks.find((record) => record.talk_number === talk_number);
};

export const setPublicTalks = async (value: PublicTalkType[]) => {
  await promiseSetRecoil(publicTalksState, value);
};
