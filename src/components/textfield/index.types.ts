import { ReactElement } from 'react';
import { TextFieldProps } from '@mui/material';
import { CustomClassName } from '@definition/app';

/**
 * Props for the TextFieldType component.
 */
export type TextFieldTypeProps = TextFieldProps & {
  /**
   * Custom class names for styling
   */
  className?: CustomClassName;
  /**
   * Icon displayed at the start of the text field
   */
  startIcon?: ReactElement;
  /**
   * Icon displayed at the end of the text field
   */
  endIcon?: ReactElement;
  /**
   * Height of the text field
   */
  height?: number;
  /**
   * Whether to reset the helper text padding
   */
  resetHelperPadding?: boolean;

  /**
   * Whether to apply color to svg
   */
  styleIcon?: boolean;

  // Dont use for password fields, use type = "password"
  endAdornment?: JSX.Element;

  success?: boolean;
};
