import { PersonType } from '@definition/person';
import { FullnameOption } from '@definition/settings';
import { SpeakerDraftType } from '../index.types';

export type SpeakerInfoTabType = {
  draft: SpeakerDraftType;
  local: boolean;
  displayNameEnabled: boolean;
  fullnameOption: FullnameOption;
  persons: PersonType[];
  onFirstnameChange: (value: string) => void;
  onLastnameChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onPrivilegeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onPersonChange: (value: string) => void;
};
