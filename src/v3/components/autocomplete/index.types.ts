import { ReactElement, ReactNode } from 'react';
import { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material';

export type AutocompletePropsType<T> = Omit<
  AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput'
> & {
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  label: string;
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
};
