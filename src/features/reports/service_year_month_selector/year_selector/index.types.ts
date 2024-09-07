import { SxProps, Theme } from '@mui/material';

export type YearSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
};
