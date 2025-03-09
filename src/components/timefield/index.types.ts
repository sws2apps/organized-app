import { SxProps, Theme } from '@mui/material';
import { CustomClassName } from '@definition/app';

export type TimeFieldProps = {
  className?: CustomClassName;
  value?: string;
  onChange?: (value: string) => void;
  sx?: SxProps<Theme>;
  hoursLength?: number;
};
