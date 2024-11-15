import { SxProps, Theme } from '@mui/material';

export type MonthSelectorProps = {
  year: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
};
