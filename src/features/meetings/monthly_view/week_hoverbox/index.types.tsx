import { SourceAssignmentType } from '@definition/sources';
import { SxProps } from '@mui/material';
import { ReactNode } from 'react';

export type WeekHoverBoxType = {
  children: ReactNode;
  type: SourceAssignmentType;
  sx?: SxProps;
  week: string;
};
