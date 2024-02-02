import { ReactElement } from 'react';
import { AutocompleteProps } from '@mui/material';

export type AutocompletePropsType = AutocompleteProps<string, false, true, false> & {
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  label: string;
};
