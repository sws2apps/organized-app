import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export type TabSwitcherOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactElement<{ width?: number; height?: number; color?: string }>;
  disabled?: boolean;
  badge?: ReactNode;
  panelId?: string;
};

export type TabSwitcherProps<T extends string = string> = {
  options: TabSwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  id?: string;
  wrapLabels?: boolean;
  sx?: SxProps<Theme>;
};
