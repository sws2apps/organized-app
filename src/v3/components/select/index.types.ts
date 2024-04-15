import { ReactElement } from 'react';
import { TextFieldProps } from '@mui/material';

export type SelectPropsType = TextFieldProps & {
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
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  height?: number;
};
