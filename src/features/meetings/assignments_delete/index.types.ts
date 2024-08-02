import { MeetingType } from '@definition/app';

export type AssignmentsDeleteType = {
  open: boolean;
  onClose: VoidFunction;
  meeting: MeetingType;
};
