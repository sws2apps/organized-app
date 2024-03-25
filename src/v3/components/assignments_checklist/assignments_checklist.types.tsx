import { PropsWithChildren } from 'react';

export type CPEAssignmentCheckListColors =
  | 'midweek-meeting'
  | 'treasures-from-gods-word'
  | 'apply-yourself-to-the-field-ministry'
  | 'living-as-christians'
  | 'weekend-meeting'
  | 'ministry'
  | 'duties';

export interface CPEAssignmentCheckListProps extends PropsWithChildren {
  header: string;
  showIcon?: boolean;
  disabled?: boolean;
  color: CPEAssignmentCheckListColors;
}
