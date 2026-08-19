export type ScheduleExportType = {
  open: boolean;
  onClose: VoidFunction;
  meeting?: 'midweek' | 'weekend';
};

export type ScheduleExportScope = 'all' | 'specific' | 'joint';
