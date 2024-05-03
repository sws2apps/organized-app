import { ReactElement } from 'react';
import { TextFieldProps } from '@mui/material';

/**
 * Props for the Select component.
 */
export type SelectPropsType = TextFieldProps & {
  /**
   * Additional CSS class for styling the component.
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
   * The icon to display at the start of the select input.
   */
  startIcon?: ReactElement;

  /**
   * The icon to display at the end of the select input.
   */
  endIcon?: ReactElement;

  /**
   * The height of the select input.
   */
  height?: number;
};
