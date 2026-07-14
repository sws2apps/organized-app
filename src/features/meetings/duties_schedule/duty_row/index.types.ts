import { ReactElement } from 'react';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';

export type DutyFieldType = {
  assignment: AssignmentFieldType;
  type: AssignmentCode;
  label: string;
  schedule_id?: string;
};

export type DutyRowProps = {
  duty: string;
  icon: ReactElement;
  week: string;
  fields: DutyFieldType[];
};
