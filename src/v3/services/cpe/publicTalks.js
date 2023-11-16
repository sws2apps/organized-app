import { promiseGetRecoil } from 'recoil-outside';
import { publicTalksLocaleState, publicTalksState } from '@states/publicTalks';

export const publicTalkFindLocal = async (talk_number) => {
  const talks = await promiseGetRecoil(publicTalksLocaleState);
  const found = talks.find((talk) => talk.talk_number === talk_number);
  return found?.talk_title || '';
};

export const getS34 = async (talk_number) => {
  const talks = await promiseGetRecoil(publicTalksState);
  return talks.find((record) => record.talk_number === talk_number);
};
