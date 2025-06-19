import { PublicTalkLocaleType } from '@definition/public_talks';
import { PublicTalkType } from '@definition/schedules';

export type PublicTalkSelectorType = {
  week: string;
  showSpeakerCount?: boolean;
  type: PublicTalkType;
  schedule_id?: string;
  readOnly?: boolean;
};

export type PublicTalkOptionType = PublicTalkLocaleType & {
  speakers: number;
};
