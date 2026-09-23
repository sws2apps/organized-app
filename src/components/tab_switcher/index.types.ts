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
   * What the switch sits on:
   * - `tinted` (default): light accent backgrounds, such as `--accent-150`
   * - `light`: white and other light backgrounds, such as cards, where the
   *   tinted colours would compete with the content
   */
  surface?: TabSwitcherSurface;
  /** Only the icons show; each label becomes the option's accessible name. */
  iconOnly?: boolean;
  sx?: SxProps<Theme>;
};

export type TabSwitcherSurface = 'tinted' | 'light';
