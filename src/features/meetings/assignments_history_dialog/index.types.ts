import { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentsHistoryDialogType = {
  open: boolean;
  onClose: VoidFunction;
  person: string;
  history: AssignmentHistoryType[];
};
