import { UpcomingEventType } from '@definition/upcoming_events';
import { Table } from 'dexie';

export type UpcomingEventsTable = {
  upcoming_events: Table<UpcomingEventType>;
};

export const upcomingEventsSchema = {
  upcoming_events: '&event_uid, date, time, type, additional, custom, _deleted',
};
