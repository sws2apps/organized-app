import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type IncomingSpeakerRowEditType = {
  speaker: VisitingSpeakerType;
  onEdit: (person_uid: string) => void;
};
