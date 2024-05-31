import { atom } from 'recoil';
import { SongType } from '@definition/songs';

export const songsState = atom<SongType[]>({
  key: 'songs',
  default: [],
});
