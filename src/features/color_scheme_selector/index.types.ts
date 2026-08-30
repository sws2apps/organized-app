import { ColorSchemeType } from '@definition/app';

export type ColorSchemeSelectorType = {
  value: ColorSchemeType;
  selected: ColorSchemeType;
  label: string;
  onClick: (value: ColorSchemeType) => void;
};
