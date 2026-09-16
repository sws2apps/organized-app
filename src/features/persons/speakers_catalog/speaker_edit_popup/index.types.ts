import { PublicTalkLocaleType } from '@definition/public_talks';
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
};

export type SpeakerTalkRowType = {
  key: string;
  talk: PublicTalkLocaleType | null;
  songs: number[];
};

export type SpeakerTalkStateType = {
  key: string;
  talk_number: number | null;
  songs: number[];
};
