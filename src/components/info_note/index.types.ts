import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

export type InfoNoteColor = 'accent' | 'black';

export type InfoNoteProps = {
  variant?: 'inline' | 'card';
  message?: string;
  children?: ReactNode;
  color?: InfoNoteColor;
  icon?: ReactElement;
  sx?: SxProps<Theme>;
};
