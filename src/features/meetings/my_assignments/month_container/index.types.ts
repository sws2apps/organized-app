import { AssignmentHistoryType } from '@definition/schedules';

export type AssignmentsMonthContainerProps = {
  monthData: {
    month: string;
    children: AssignmentHistoryType[];
  };
};
