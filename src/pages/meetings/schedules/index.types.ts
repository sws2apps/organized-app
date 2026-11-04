export type WeeklySchedulesType = 'midweek' | 'weekend' | 'outgoing';

/**
 * Router state that opens the schedules on a given tab and week.
 */
export type WeeklySchedulesLocationState = {
  schedule?: WeeklySchedulesType;
  week?: string;
};
