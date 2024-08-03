import { PublicTalkType } from '@definition/public_talks';

export type PublicTalkSelectorType = {
  week: string;
  showSpeakerCount?: boolean;
};

export type PublicTalkOptionType = PublicTalkType & {
  speakers: number;
};
