import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakerDetailsType = {
  open: boolean;
  onClose: VoidFunction;
  speaker: VisitingSpeakerType;
};
