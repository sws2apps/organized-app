import { ChangeEvent } from 'react';

export type CustomBoxWithSwitchProps = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label: string;
};
