import { SxProps, Theme } from '@mui/material';
import { CustomClassName } from '@definition/app';

export type DateNavigatorDirection = 'back' | 'next';

export type DateNavigatorType = {
  value: string;
  onBack?: VoidFunction;
  onNext?: VoidFunction;
  disableBack?: boolean;
  disableNext?: boolean;
  labelClassName?: CustomClassName;
  labelMinWidth?: string | number;
  sx?: SxProps<Theme>;
};
