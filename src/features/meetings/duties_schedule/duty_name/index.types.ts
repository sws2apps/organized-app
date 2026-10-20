import { ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

export type DutyNameProps = {
  duty: string;
  icon: ReactElement;
  sx?: SxProps<Theme>;
};
