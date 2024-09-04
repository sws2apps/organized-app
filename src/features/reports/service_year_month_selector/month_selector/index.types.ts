import { SxProps, Theme } from '@mui/material';

export type MonthSelectorProps = {
  year: string;
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
};
