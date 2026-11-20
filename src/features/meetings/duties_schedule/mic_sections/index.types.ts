import {
  DutiesSectionType,
  DutiesMeetingPartType,
} from '@definition/schedules';
import { DutiesMeetingPrefixType } from '@definition/assignment';

export type MicSectionsProps = {
  week: string;
  prefix: DutiesMeetingPrefixType;
  meeting: 'midweek' | 'weekend';
};

export type SectionEditProps = {
  availableSections: Omit<DutiesSectionType, 'dataView'>[];
  availableParts: DutiesMeetingPartType[];
  onSave: (
    values: Pick<DutiesSectionType, 'name' | 'amount' | 'parts'>
  ) => void | Promise<void>;
  open: boolean;
  onClose: VoidFunction;
  type: 'add' | 'edit';
  id?: string;
};
