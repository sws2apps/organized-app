import React from 'react';
import { TextFieldProps } from '@mui/material';

export type MultiSelectPropsType = TextFieldProps & {
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

  height?: number;
  label?: string;
  options?: string[];
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
