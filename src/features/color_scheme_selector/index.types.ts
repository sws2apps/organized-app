import { FormControlLabelProps } from '@mui/material';
import { ColorSchemeType } from '@definition/app';

export type ColorSchemeSelectorType = Omit<
  FormControlLabelProps,
  'control' | 'label'
> & {
  value: ColorSchemeType;
  selected: ColorSchemeType;
  label: string;
};
