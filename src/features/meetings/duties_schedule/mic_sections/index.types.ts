import { DutiesMeetingPrefixType } from '@definition/assignment';

export type MicSectionsProps = {
  week: string;
  prefix: DutiesMeetingPrefixType;
};

export type SectionEditProps = {
  open: boolean;
  onClose: VoidFunction;
  type: 'add' | 'edit';
  id?: string;
};

export type SectionDeleteProps = {
  open: boolean;
  onClose: VoidFunction;
  id: string;
};
