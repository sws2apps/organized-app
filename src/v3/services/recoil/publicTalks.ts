import { promiseSetRecoil } from 'recoil-outside';
import { publicTalksSearchKeyState } from '@states/publicTalks';

export const setPublicTalksSearchKey = async (value: string) => {
  await promiseSetRecoil(publicTalksSearchKeyState, value);
};
