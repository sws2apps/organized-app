import { PublicTalkType } from '@definition/public_talks';

export type SongsTalkType = {
  onChange: (talk_number: number, songs: number[]) => void;
  onDelete: (talk_number: number, song: number) => void;
  talk: PublicTalkType;
  songs: number[];
  edit?: boolean;
};
