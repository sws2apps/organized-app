import { PublicTalksViewType, PublicTalkType } from '@definition/public_talks';

export type PublicTalksType = { view: PublicTalksViewType };

export type TalkItemType = PublicTalkType & {
  last_date: string;
  last_speaker: string;
  history: { date: string; person: string }[];
};
