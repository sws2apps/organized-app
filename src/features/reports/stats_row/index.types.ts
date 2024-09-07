import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export type StatsRowProps = {
  title: string;
  value: number;
  color?: CSSProperties['color'];
  colorValue?: boolean;
  sx?: SxProps<Theme>;
};
