import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { publicTalksSearchKeyState, publicTalksLocaleState, publicTalksState } from '@states/publicTalks';
import { TalkLocaleType, TalkType } from '@definition/sources';

export const setPublicTalksSearchKey = async (value: string) => {
  await promiseSetRecoil(publicTalksSearchKeyState, value);
};

export const publicTalksFind = async (talk_number: number) => {
  const talks: TalkType[] = await promiseGetRecoil(publicTalksState);
  return talks.find((record) => record.talk_number === talk_number);
};

export const publicTalksFindLocal = async (talk_number: number) => {
  const talks: TalkLocaleType[] = await promiseGetRecoil(publicTalksLocaleState);
  const found = talks.find((talk) => talk.talk_number === talk_number);
  return found?.talk_title || '';
};
