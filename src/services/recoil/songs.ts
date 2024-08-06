import { promiseSetRecoil } from 'recoil-outside';
import { SongType } from '@definition/songs';
import { songsState } from '@states/songs';

export const setSongs = async (value: SongType[]) => {
  await promiseSetRecoil(songsState, value);
};
