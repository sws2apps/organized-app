import { PublicTalkLocaleType } from '@definition/public_talks';
import { SongLocaleType } from '@definition/songs';
import { SpeakerTalkRowType } from '../index.types';

export type SpeakerTalksTabType = {
  publicTalks: PublicTalkLocaleType[];
  rows: SpeakerTalkRowType[];
  onRowAdd: VoidFunction;
  onRowRemove: (row: SpeakerTalkRowType) => void;
  onTalkChange: (
    row: SpeakerTalkRowType,
    talk: PublicTalkLocaleType | null
  ) => void;
  onSongsChange: (row: SpeakerTalkRowType, songs: SongLocaleType[]) => void;
};
