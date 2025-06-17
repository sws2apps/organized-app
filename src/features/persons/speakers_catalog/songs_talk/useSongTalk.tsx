import { useAtomValue } from 'jotai';
import { songsLocaleState } from '@states/songs';

const useSongTalk = (songs: number[]) => {
  const songsOption = useAtomValue(songsLocaleState);

  const selectedSongs = songs.map((record) => {
    const talk = songsOption.find((item) => item.song_number === record);
    return talk;
  });

  return { songsOption, selectedSongs };
};

export default useSongTalk;
