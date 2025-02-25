import { SourceAssignmentType } from '@definition/sources';

export type BrotherAssignmentProps = {
  durationEditable?: boolean;
  isEdit: boolean;
  selectedWeek: string;
  type: SourceAssignmentType;
  isOverwrite?: boolean;
};
