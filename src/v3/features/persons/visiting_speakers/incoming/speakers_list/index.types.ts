import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakersListType = {
  speakers: VisitingSpeakerType[];
  isEditMode: boolean;
  cong_number: string;
};
