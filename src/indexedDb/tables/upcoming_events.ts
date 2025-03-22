import { UpcomingEventsWrapperType } from '@definition/upcoming_events';
import { Table } from 'dexie';

export type UpcomingEventsTable = {
  upcoming_events: Table<UpcomingEventsWrapperType>;
};

export const upcomingEventsSchema = {
  upcoming_events: '++id, years',
};
