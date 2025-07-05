import { AssignmentFieldType } from '@definition/assignment';

export type SiblingAssignmentsProps = {
  week: string;
  assignment: AssignmentFieldType;
};

export type Assignments = {
  type: string;
  value: string;
};
