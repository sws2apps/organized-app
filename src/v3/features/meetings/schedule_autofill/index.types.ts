export type ScheduleAutofillType = {
  open: boolean;
  onClose: VoidFunction;
  meeting: 'midweek' | 'weekend';
};
