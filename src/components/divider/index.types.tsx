import { DividerProps, SxProps, Theme } from '@mui/material';

/**
 * Props for a custom divider component.
 */
export type CustomDividerProps = DividerProps & {
  /**
   * The color of the divider.
   */
  color?: string;

  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;

  /**
   * The height of the divider.
   */
  height?: number;

  dashed?: boolean;
};
