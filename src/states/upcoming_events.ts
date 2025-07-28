/*
This file holds the source of the truth from the table "upcoming_events".
*/

import { atom } from 'jotai';
import { UpcomingEventType } from '@definition/upcoming_events';

export const upcomingEventsDbState = atom<UpcomingEventType[]>([]);

export const upcomingEventsState = atom((get) => {
  const events = get(upcomingEventsDbState);

  return events
    .filter((record) => !record._deleted)
    .sort((a, b) => a.event_data.start.localeCompare(b.event_data.start));
});
