import { atom } from 'jotai';
import { SongType } from '@definition/songs';

export const songsState = atom<SongType[]>([]);
