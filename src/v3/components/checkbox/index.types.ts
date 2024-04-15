import { ChangeEvent } from 'react';
import { CustomClassName } from '@definition/app';
import { SxProps } from '@mui/material';

export type CheckboxPropsType = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label?: string;
  isBorder?: boolean;
  className?: CustomClassName;
  sx?: SxProps;
};
