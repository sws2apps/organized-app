import { CustomClassName } from '@definition/app';
import { SxProps, Theme } from '@mui/material';

export type LabelRowProps = {
  name: string;
  value: string | number;
  color?: string;
  className?: CustomClassName;
  sx?: SxProps<Theme>;
};
