import { AssignmentCheckListColors } from '@definition/app';
import { AssignmentCode } from '@definition/assignment';

export type AssignmentGroupType = {
  id: string;
  header: string;
  color: AssignmentCheckListColors;
  items: { code: AssignmentCode; name: string; borderTop?: boolean }[];
  onHeaderChange?: (checked: boolean, id: string) => void;
  onItemChange?: (checked: boolean, code: AssignmentCode) => void;
  checkedItems: AssignmentCode[];
  male: boolean;
  disqualified?: boolean;
  readOnly?: boolean;
};
