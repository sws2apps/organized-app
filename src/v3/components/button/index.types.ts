import { HTMLAttributeAnchorTarget, MouseEventHandler, ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export type ButtonPropsType = {
  className?: 'button-caps' | 'button-small-caps' | 'body-small-semibold';
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  variant: 'main' | 'secondary' | 'tertiary' | 'small' | 'semi-white';
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  color?: string;
  sx?: SxProps<Theme>;
  disableAutoStretch?: boolean;
  target?: HTMLAttributeAnchorTarget | undefined;
  rel?: string | undefined;
  href?: string;
};
