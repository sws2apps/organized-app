import { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentsDay = {
  date: string;
  assignments: AssignmentHistoryType[];
};

export type AssignmentsWeek = {
  weekOf: string;
  days: AssignmentsDay[];
};

export type AssignmentsMonth = {
  month: string;
  total: number;
  weeks: AssignmentsWeek[];
};

export type PersonAssignments = {
  byMonth: AssignmentsMonth[];
  total: number;
};

export type OpenAssignment = (history: AssignmentHistoryType) => void;
