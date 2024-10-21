import { SourceAssignmentType } from '@definition/sources';
import { ReactNode } from 'react';

export type WeekHoverBoxType = {
  children: ReactNode;
  type: SourceAssignmentType;
  week: string;
};
