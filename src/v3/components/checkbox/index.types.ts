import { ChangeEvent } from 'react';

export type CheckboxPropsType = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label?: string;
  isBorder?: boolean;
};
