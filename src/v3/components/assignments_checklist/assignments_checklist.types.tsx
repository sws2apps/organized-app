import { PropsWithChildren } from 'react';
import { AssignmentCheckListColors } from '@definition/app';

export interface AssignmentCheckListProps extends PropsWithChildren {
  header: string;
  disabled?: boolean;
  color: AssignmentCheckListColors;
  onChange?: (boolean) => void;
}
