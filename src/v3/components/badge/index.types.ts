import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export type BadgePropsType = {
  size: 'small' | 'medium' | 'big';
  filled?: boolean;
  text: string;
  color: 'red' | 'grey' | 'green' | 'orange' | 'accent' | 'transparent';
  fullWidth?: boolean;
  centerContent?: boolean;
  borderStyle?: 'dashed' | 'solid';
  icon?: ReactElement;
  sx?: SxProps<Theme>;
};

export type BadgeTypographyPropsType = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export type BadgeContentPropsType = {
  color: string;
  children: ReactNode;
  icon?: ReactElement;
  iconHeight: string;
  iconWidth: string;
};
