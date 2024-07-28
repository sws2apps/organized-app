import { Table } from 'dexie';
import { AssignmentType } from '@definition/assignment';

export type AssignmentTable = {
  assignment: Table<AssignmentType>;
};

export const assignmentSchema = {
  assignment: '&code, assignable, linkTo, type, assignment_type_name',
};
