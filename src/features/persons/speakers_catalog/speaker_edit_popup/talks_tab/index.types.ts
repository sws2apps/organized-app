import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongType } from '@definition/songs';

export type SpeakerTalksTabType = {
  publicTalks: PublicTalkLocaleType[];
  selectedTalks: PublicTalkLocaleType[];
  talksWithSongs: { talk: PublicTalkLocaleType; songs: number[] }[];
  onTalksUpdate: (value: PublicTalkLocaleType[]) => void;
  onTalksDelete: (talk_number: number) => void;
  onSongsUpdate: (talk_number: number, songs: SongType[]) => void;
  onSongsDelete: (talk_number: number, song: number) => void;
};
