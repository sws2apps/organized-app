import { PublicTalkType } from '@definition/public_talks';

export type PopupSongAddType = {
  open: boolean;
  onClose: VoidFunction;
  onChange: (talk_number: number, songs: number[]) => void;
  onDelete: (talk_number: number, song: number) => void;
  talk: PublicTalkType;
  songs: number[];
};
