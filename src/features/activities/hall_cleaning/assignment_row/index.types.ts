import { ReactElement, ReactNode } from 'react';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';

export type CleaningFieldType = {
  assignment: AssignmentFieldType;
  type: AssignmentCode;
  label: string;
  schedule_id?: string;
};

export type CleaningRowProps = {
  duty: string;
  icon: ReactElement;
  week: string;
  fields?: CleaningFieldType[];
  /** one entry per duty column; its fields stack vertically */
  columns?: CleaningFieldType[][];
  // shown above the person fields, e.g. the group a cleaning goes to
  children?: ReactNode;
  allowedPersons?: string[];
  minFieldWidth?: number;
};
