import { SourceAssignmentType } from '@definition/sources';
import { SxProps } from '@mui/material';
import { ReactElement } from 'react';

export type WeekHoverBoxType = {
  children: ReactElement;
  type: SourceAssignmentType;
  sx?: SxProps;
  week: string;
};
