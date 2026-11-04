import type { AssignmentCode } from '@definition/assignment';
import type { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentConflict = {
  title: string;
  details: { title: string; minutes?: number }[];
  isDuty: boolean;
  blocked: boolean;
  penalty: number;
};

export type AssignmentConflictContext = {
  week: string;
  dataView: string;
  assignment: string;
  code?: AssignmentCode;
  scheduleId?: string;
  wholeWeek?: boolean;
  history: AssignmentHistoryType[];
  minutes: Record<string, number>;
};
