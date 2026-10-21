import { ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

export type CleaningNameProps = {
  duty: string;
  icon: ReactElement;
  sx?: SxProps<Theme>;
};
