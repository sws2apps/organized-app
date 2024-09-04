import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export type RowStatsProps = {
  title: string;
  value: number;
  color?: CSSProperties['color'];
  sx?: SxProps<Theme>;
};
