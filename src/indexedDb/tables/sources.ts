import { Table } from 'dexie';
import { SourceWeekType } from '@definition/sources';

export type SourcesTable = {
  sources: Table<SourceWeekType>;
};

export const sourcesSchema = {
  sources: '&weekOf, midweek_meeting, weekend_meeting',
};
