import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakerContactInfoType = {
  speaker: VisitingSpeakerType;
  onClose: VoidFunction;
};
