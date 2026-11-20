import { ReactNode } from 'react';

export type SwitchWithLabelProps = {
  label: string;
  helper?: string;
  action?: ReactNode;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  readOnly?: boolean;
  disabled?: boolean;
};
