import { ChangeEvent } from 'react';
import { SxProps, Theme } from '@mui/material';

export type ClassroomCheckboxType = {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  classrooms: { id: string; label: string }[];
  selected: string[];
  onClassroomsChange: (classrooms: string[]) => void;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
};
