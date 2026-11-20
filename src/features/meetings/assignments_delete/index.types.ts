import { ScheduleMeetingType } from '@definition/app';

export type AssignmentsDeleteType = {
  open: boolean;
  onClose: VoidFunction;
  meeting: ScheduleMeetingType;
};
