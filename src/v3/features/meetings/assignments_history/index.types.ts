import { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentsHistoryType = {
  history: AssignmentHistoryType[];
  isDialog?: boolean;
};

export type FormattedHistoryType = {
  history_id: string;
  history_date: string;
  history_assignment: string;
  history_hall: string;
  history_misc: AssignmentHistoryType['assignment'];
};
