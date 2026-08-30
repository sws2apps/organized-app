import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type IncomingSpeakerEditPopupType = {
  open: boolean;
  onClose: VoidFunction;
  speaker: VisitingSpeakerType;
};
