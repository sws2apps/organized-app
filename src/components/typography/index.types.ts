import { TypographyProps } from '@mui/material';
import { CustomClassName } from '@definition/app';

/**
 * Props for the CustomTypography component.
 */
export type TypographyTypeProps = TypographyProps & {
  /**
   * The class name to apply to the Typography component.
   */
  className?: CustomClassName;
};
