import { atom } from 'jotai';
import { SongLocaleType, SongType } from '@definition/songs';
import { JWLangState } from './settings';

export const songsState = atom<SongType[]>([]);

export const songsLocaleState = atom((get) => {
  const lang = get(JWLangState);
  const songs = get(songsState);

  return songs.map((song) => {
    return {
      song_number: song.song_number,
      song_title: song.song_title[lang] ?? '',
    } as SongLocaleType;
  });
});
