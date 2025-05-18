import { Key } from 'react';

export type MiniChipProps = {
  label: string;
  edit?: boolean;
  onDelete?: VoidFunction;
  disabled?: boolean;
  key?: Key;
};
