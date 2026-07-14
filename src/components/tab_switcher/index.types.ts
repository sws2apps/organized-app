import { ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

export type TabSwitcherOption<T extends string = string> = {
  value: T;
  label: string;
  // Color is driven by the switcher, so no `color` prop needed.
  icon?: ReactElement<{ width?: number; height?: number; color?: string }>;
  disabled?: boolean;
};

export type TabSwitcherProps<T extends string = string> = {
  options: TabSwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
};
