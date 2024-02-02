import { promiseGetRecoil } from 'recoil-outside';
import { publicTalksLocaleState, publicTalksState } from '@states/publicTalks';
import { TalkLocaleType, TalkType } from '@definition/sources';

export const publicTalkFindLocal = async (talk_number: number) => {
  const talks: TalkLocaleType[] = await promiseGetRecoil(publicTalksLocaleState);
  const found = talks.find((talk) => talk.talk_number === talk_number);
  return found?.talk_title || '';
};

export const getS34 = async (talk_number: number) => {
  const talks: TalkType[] = await promiseGetRecoil(publicTalksState);
  return talks.find((record) => record.talk_number === talk_number);
};
