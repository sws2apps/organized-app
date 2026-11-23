import { AppFontSizeType } from '@definition/app';

export type FontSizeOptionType = {
  value: AppFontSizeType;
  labelKey: string;
  scale: number;
};

export type FontSizePreviewPropsType = {
  scale: number;
  // scale of the option currently applied to the app, which 1rem resolves to
  activeScale: number;
};
