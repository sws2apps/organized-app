import { Table } from 'dexie';
import { SchedWeekType } from '@definition/schedules';

export type SchedTable = {
  sched: Table<SchedWeekType>;
};

export const schedSchema = {
  sched: '&weekOf, midweek_meeting, weekend_meeting, released',
};
