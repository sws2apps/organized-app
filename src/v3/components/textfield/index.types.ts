import { ReactElement } from 'react';
import { TextFieldProps } from '@mui/material';

/**
 * Props for the TextFieldType component.
 */
export type TextFieldTypeProps = TextFieldProps & {
  /**
   * Custom class names for styling
   */
  className?:
    | 'huge-numbers'
    | 'big-numbers'
    | 'label-small-medium'
    | 'label-small-regular'
    | 'h1'
    | 'h2'
    | 'h2-caps'
    | 'h3'
    | 'h4'
    | 'button-caps'
    | 'body-regular'
    | 'body-small-semibold'
    | 'body-small-regular';
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
};
