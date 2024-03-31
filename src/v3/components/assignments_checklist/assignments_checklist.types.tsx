import { PropsWithChildren } from 'react';

export type AssignmentCheckListColors =
  | 'midweek-meeting'
  | 'treasures-from-gods-word'
  | 'apply-yourself-to-the-field-ministry'
  | 'living-as-christians'
  | 'weekend-meeting'
  | 'ministry'
  | 'duties';

export interface AssignmentCheckListProps extends PropsWithChildren {
  header: string;
  disabled?: boolean;
  color: AssignmentCheckListColors;
}
