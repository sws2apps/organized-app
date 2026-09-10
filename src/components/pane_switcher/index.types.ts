import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * Props type for the PaneSwitcher component.
 */
export type PaneSwitcherProps = {
  /**
   * Panes to switch between, in the order they are laid out.
   */
  panes: { key: string; content: ReactNode }[];

  /**
   * Index of the pane to show.
   */
  value: number;

  /**
   * Lets the panes slide out to the edge of the screen instead of the edge of
   * the page container.
   */
  fullBleed?: boolean;

  /**
   * Custom styles for the container.
   */
  sx?: SxProps<Theme>;
};
