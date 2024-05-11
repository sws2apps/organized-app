import { Table } from 'dexie';
import { WeekType } from '@definition/sources';

export type WeekTypeTable = {
  week_type: Table<WeekType>;
};

export const weekTypeSchema = {
  week_type: '&id, week_type_name, sort_index',
};
