import {
  DutiesSectionType,
  DutiesMeetingPartType,
} from '@definition/schedules';
import { DutiesMeetingPrefixType } from '@definition/assignment';

export type MicSectionsProps = {
  management?: boolean;
  week: string;
  prefix: DutiesMeetingPrefixType;
  meeting: 'midweek' | 'weekend';
};

export type SectionEditProps = {
  availableSections?: DutiesSectionType[];
  availableParts?: DutiesMeetingPartType[];
  onSave?: (
    values: Pick<DutiesSectionType, 'name' | 'amount' | 'parts'>
  ) => Promise<void>;
  recurring?: boolean;
  open: boolean;
  onClose: VoidFunction;
  type: 'add' | 'edit';
  meeting: 'midweek' | 'weekend';
  week: string;
  id?: string;
};
