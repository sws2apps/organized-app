import { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentsHistoryType = {
  open: boolean;
  onClose: VoidFunction;
  person: string;
  history: AssignmentHistoryType[];
};

export type FormattedHistoryType = {
  history_date: string;
  history_assignment: string;
  history_hall: string;
  history_misc: AssignmentHistoryType['assignment'];
};
