import { AssignmentCheckListColors } from '@definition/app';
import { AssignmentCode } from '@definition/assignment';
import { SxProps, Theme } from '@mui/material';

export type ClassroomQualificationsType = {
  codes: AssignmentCode[];
  classrooms: { id: string; label: string }[];
  getSelected: (code: AssignmentCode) => string[];
  onChange: (code: AssignmentCode, classrooms: string[]) => void;
};

export type AssignmentGroupType = {
  id: string;
  header: string;
  color: AssignmentCheckListColors;
  items: { code: AssignmentCode; name: string; borderTop?: boolean }[];
  onHeaderChange?: (checked: boolean, id: string) => void;
  onItemChange?: (checked: boolean, code: AssignmentCode) => void;
  checkedItems: AssignmentCode[];
  classroomQualifications?: ClassroomQualificationsType;
  male: boolean;
  disqualified?: boolean;
  readOnly?: boolean;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
};
