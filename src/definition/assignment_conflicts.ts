import type { AssignmentCode } from '@definition/assignment';
import type {
  AssignmentHistoryType,
  DutiesSectionType,
} from '@definition/schedules';

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
  sections: { midweek: DutiesSectionType[]; weekend: DutiesSectionType[] };
  minutes: Record<string, number>;
};
