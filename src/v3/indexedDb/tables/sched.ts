import { Table } from 'dexie';
import { SchedWeekType } from '@definition/schedules';

export type SchedTable = {
  sched: Table<SchedWeekType>;
};

export const schedSchema = {
  sched: '&weekOf, week_type, midweek_meeting, weekend_meeting, released',
};
