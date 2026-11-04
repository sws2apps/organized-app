import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

export type InfoNoteProps = {
  variant?: 'inline' | 'card' | 'subtle';
  showIcon?: boolean;
  label?: string;
  preserveWhitespace?: boolean;
  message?: string;
  children?: ReactNode;
  icon?: ReactElement;
  sx?: SxProps<Theme>;
};
