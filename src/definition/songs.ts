export type SongType = {
  song_number: number;
  song_title: { [language: string]: string };
};

export type SongLocaleType = {
  song_number: number;
  song_title: string;
};
