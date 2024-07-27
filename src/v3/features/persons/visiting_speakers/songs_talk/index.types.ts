import { PublicTalkType } from '@definition/public_talks';
import { SongType } from '@definition/songs';

export type SongsTalkType = {
  onChange: (talk_number: number, songs: SongType[]) => void;
  onDelete: (talk_number: number, song: number) => void;
  talk: PublicTalkType;
  songs: number[];
  edit?: boolean;
};
