import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

export type InfoNoteProps = {
  variant?: 'inline' | 'card';
  message?: string;
  children?: ReactNode;
  icon?: ReactElement;
  sx?: SxProps<Theme>;
};
