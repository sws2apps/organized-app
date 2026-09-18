import { AssignmentHistoryType } from '@definition/schedules';
import { OpenAssignment } from '../indextypes';

export type AssignmentItemProps = {
  history: AssignmentHistoryType;
  onOpen: OpenAssignment;
};
