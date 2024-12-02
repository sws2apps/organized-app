import { PropsWithChildren } from 'react';
import { AssignmentCheckListColors } from '@definition/app';
import { SxProps, Theme } from '@mui/material';

/**
 * Props for the AssignmentCheckList component.
 */
export interface AssignmentCheckListProps extends PropsWithChildren {
  /**
   * Header text for the assignment checklist.
   */
  header: string;

  /**
   * Indicates whether the assignment checklist is disabled.
   */
  disabled?: boolean;

  /**
   * Color theme for the assignment checklist.
   */
  color: AssignmentCheckListColors;

  /**
   * Callback function triggered when the checkbox state changes.
   * @param {boolean} checked - Indicates whether the checkbox is checked.
   */
  onChange?: (checked: boolean) => void;

  readOnly?: boolean;

  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
