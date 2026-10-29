import { ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

export type TabSwitcherOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactElement<{ width?: number; height?: number; color?: string }>;
  disabled?: boolean;
};

export type TabSwitcherProps<T extends string = string> = {
  options: TabSwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  /**
   * Ties the tabs to the panel they switch. Tabs get the id
   * `${id}-tab-${value}` and point at `${id}-panel`, which the consumer
   * renders with role="tabpanel".
   */
  id?: string;
  sx?: SxProps<Theme>;
};
