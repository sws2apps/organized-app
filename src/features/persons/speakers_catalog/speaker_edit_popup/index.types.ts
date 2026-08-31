import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type SpeakerEditPopupType = {
  open: boolean;
  onClose: VoidFunction;
  speaker?: VisitingSpeakerType;
  cong_id?: string;
  local?: boolean;
  outgoing?: boolean;
};

export type SpeakerDraftType = {
  person_uid: string;
  firstname: string;
  lastname: string;
  displayName: string;
  privilege: 'elder' | 'ms' | '';
  email: string;
  phone: string;
  note: string;
  talks: VisitingSpeakerType['speaker_data']['talks'];
};
