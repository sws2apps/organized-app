import { AssignmentsMonth, OpenAssignment } from '../indextypes';

export type AssignmentsListProps = {
  months: AssignmentsMonth[];
  resetKey: string;
  onOpen: OpenAssignment;
};
