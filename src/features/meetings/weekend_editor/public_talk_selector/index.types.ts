import { PublicTalkType as PublicTalkTypeDefault } from '@definition/public_talks';
import { PublicTalkType } from '@definition/schedules';

export type PublicTalkSelectorType = {
  week: string;
  showSpeakerCount?: boolean;
  type: PublicTalkType;
};

export type PublicTalkOptionType = PublicTalkTypeDefault & {
  speakers: number;
};
