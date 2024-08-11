export type AssignmentsWeekDeleteType = {
  open: boolean;
  onClose: VoidFunction;
  meeting: 'midweek' | 'weekend';
  week: string;
  schedule_id?: string;
};
