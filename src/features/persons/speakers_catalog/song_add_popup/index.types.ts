import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongType } from '@definition/songs';

export type PopupSongAddType = {
  open: boolean;
  onClose: VoidFunction;
  onChange: (talk_number: number, songs: SongType[]) => void;
  onDelete: (talk_number: number, song: number) => void;
  talk: PublicTalkLocaleType;
  songs: number[];
};
