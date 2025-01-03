import { SourceAssignmentType } from '@definition/sources';
import { ReactElement } from 'react';

export type WeekHoverBoxType = {
  children: ReactElement;
  type: SourceAssignmentType;
  week: string;
};
