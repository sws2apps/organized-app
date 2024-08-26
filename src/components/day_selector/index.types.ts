import { SxProps, Theme } from '@mui/material';

export type DaySelectorType = {
  label?: string;
  value?: number | string;
  onChange?: (value: number) => void;
  sx?: SxProps<Theme>;
  readOnly?: boolean;
};
