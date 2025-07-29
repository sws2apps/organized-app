/*
This file holds the source of the truth from the table "upcoming_events".
*/

import { atom } from 'jotai';
import { UpcomingEventType } from '@definition/upcoming_events';
import { formatDate } from '@utils/date';

export const upcomingEventsDbState = atom<UpcomingEventType[]>([]);

export const upcomingEventsState = atom((get) => {
  const events = get(upcomingEventsDbState);

  return events
    .filter((record) => !record._deleted)
    .sort((a, b) => a.event_data.start.localeCompare(b.event_data.start));
});

export const upcomingEventsActiveState = atom((get) => {
  const events = get(upcomingEventsState);

  return events.filter((record) => {
    const today = formatDate(new Date(), 'yyyy/MM/dd');

    const startDate = formatDate(
      new Date(record.event_data.start),
      'yyyy/MM/dd'
    );

    const endDate = formatDate(new Date(record.event_data.end), 'yyyy/MM/dd');

    return startDate >= today || endDate >= today;
  });
});
