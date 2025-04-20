import { store } from '@states/index';
import { SongType } from '@definition/songs';
import { songsState } from '@states/songs';

export const setSongs = (value: SongType[]) => {
  store.set(songsState, value);
};
