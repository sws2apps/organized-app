import { Table } from 'dexie';
import { SongType } from '@definition/songs';

export type SongTable = {
  songs: Table<SongType>;
};

export const songSchema = {
  songs: '&song_number, song_title',
};
