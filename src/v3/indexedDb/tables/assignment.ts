import { Table } from 'dexie';
import { AssignmentType } from '@definition/schedules';

export type AssignmentTable = {
  assignment: Table<AssignmentType>;
};

export const assignmentSchema = {
  assignment: '&code, assignable, linkTo, type, assignment_type_name',
};
