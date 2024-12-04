import { AssignmentCheckListColors } from '@definition/app';
import { AssignmentCode } from '@definition/assignment';
import { SxProps, Theme } from '@mui/material';

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
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
};
