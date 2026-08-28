import { DutiesMeetingPrefixType } from '@definition/assignment';

export type MicSectionsProps = {
  week: string;
  prefix: DutiesMeetingPrefixType;
  meeting: 'midweek' | 'weekend';
};

/** Why the section name was refused, if it was. */
export type SectionNameError = 'required' | 'duplicate' | undefined;

export type SectionEditProps = {
  open: boolean;
  onClose: VoidFunction;
  type: 'add' | 'edit';
  meeting: 'midweek' | 'weekend';
  week: string;
  id?: string;
};

export type SectionDeleteProps = {
  open: boolean;
  onClose: VoidFunction;
  id: string;
};
