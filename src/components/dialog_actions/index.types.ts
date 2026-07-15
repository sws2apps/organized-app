import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export type DialogActionsProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};
