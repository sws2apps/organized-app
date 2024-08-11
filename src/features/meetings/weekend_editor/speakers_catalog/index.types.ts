import { PublicTalkType } from '@definition/schedules';
import { PublicTalkType as PublicTalkTypeDefault } from '@definition/public_talks';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakersCatalogType = {
  open: boolean;
  onClose: VoidFunction;
  type: PublicTalkType;
  week: string;
  schedule_id: string;
};

export type TalkOptionType = PublicTalkTypeDefault & {
  speakers: VisitingSpeakerType[];
};
