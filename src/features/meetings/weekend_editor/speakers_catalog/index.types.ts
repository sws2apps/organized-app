import { PublicTalkType } from '@definition/schedules';
import { PublicTalkLocaleType } from '@definition/public_talks';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakersCatalogType = {
  open: boolean;
  onClose: VoidFunction;
  type: PublicTalkType;
  week: string;
  schedule_id: string;
};

export type TalkOptionType = PublicTalkLocaleType & {
  speakers: VisitingSpeakerType[];
};
