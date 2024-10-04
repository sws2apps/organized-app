import { SelectProps } from '@mui/material';

/**
 * Props for the Select component.
 */
export type SelectPropsType<T = unknown> = SelectProps<T> & {
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
};
