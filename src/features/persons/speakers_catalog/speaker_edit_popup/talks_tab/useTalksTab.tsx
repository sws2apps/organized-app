import { useAtomValue } from 'jotai';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { SpeakerTalkRowType } from '../index.types';
import { songsLocaleState } from '@states/songs';

const useTalksTab = (
  publicTalks: PublicTalkLocaleType[],
  rows: SpeakerTalkRowType[]
) => {
  const songs = useAtomValue(songsLocaleState);

  const talkOptions = (row: SpeakerTalkRowType) => {
    return publicTalks.filter((talk) => {
      if (row.talk?.talk_number === talk.talk_number) return true;

      return !rows.some(
        (record) => record.talk?.talk_number === talk.talk_number
      );
    });
  };

  const songValues = (row: SpeakerTalkRowType) => {
    return row.songs.flatMap((number) => {
      const song = songs.find((record) => record.song_number === number);

      return song ? [song] : [];
    });
  };

  return { songs, talkOptions, songValues };
};

export default useTalksTab;
