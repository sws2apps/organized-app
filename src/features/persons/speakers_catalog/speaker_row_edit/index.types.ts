import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakerRowEditType = {
  speaker: VisitingSpeakerType;
  onEdit: (person_uid: string) => void;
};
