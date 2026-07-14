import { ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * A single selectable segment in the {@link TabSwitcher}.
 */
export type TabSwitcherOption<T extends string = string> = {
  /**
   * Unique value identifying the segment.
   */
  value: T;

  /**
   * Text label shown in the segment.
   */
  label: string;

  /**
   * Optional icon rendered before the label. Its color is driven by the
   * switcher (active / inactive), so it does not need its own `color` prop.
   */
  icon?: ReactElement<{ width?: number; height?: number; color?: string }>;

  /**
   * Disables this segment.
   */
  disabled?: boolean;
};

/**
 * Props for the {@link TabSwitcher} segmented control.
 *
 * Generic over the option value type so callers get exact typing on `value` /
 * `onChange` (e.g. a `'present' | 'online'` union).
 */
export type TabSwitcherProps<T extends string = string> = {
  /**
   * Segments to render. Two or more supported; the active indicator sizes
   * itself to the number of options.
   */
  options: TabSwitcherOption<T>[];

  /**
   * Currently selected value.
   */
  value: T;

  /**
   * Called with the new value when a segment is selected.
   */
  onChange: (value: T) => void;

  /**
   * Accessible label for the group.
   */
  ariaLabel?: string;

  /**
   * Optional style overrides for the outer container.
   */
  sx?: SxProps<Theme>;
};
