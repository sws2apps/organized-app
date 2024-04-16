import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';
import { BadgeColor } from '@definition/app';

export type BadgePropsType = {
  size: 'small' | 'medium' | 'big';
  filled?: boolean;
  text: string;
  color: BadgeColor;
  fullWidth?: boolean;
  centerContent?: boolean;
  borderStyle?: 'dashed' | 'solid';
  icon?: ReactElement;
  sx?: SxProps<Theme>;
  key?: number | string;
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
