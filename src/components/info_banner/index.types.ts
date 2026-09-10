import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';
import { CustomClassName } from '@definition/app';

export type InfoBannerVariant = 'orange' | 'green' | 'red';

export interface InfoBannerProps {
  children: ReactNode;
  variant?: InfoBannerVariant;
  icon?: ReactNode;
  bordered?: boolean;
  className?: CustomClassName;
  sx?: SxProps<Theme>;
}
