/*
This file holds the source of the truth from the table "upcoming_events".
*/

import { atom } from 'jotai';
import { UpcomingEventType } from '@definition/upcoming_events';
import { formatDate } from '@utils/date';
import { userDataViewState } from './settings';

export const upcomingEventsDbState = atom<UpcomingEventType[]>([]);

export const upcomingEventsState = atom((get) => {
  const events = get(upcomingEventsDbState);

  return events
    .filter((record) => !record.event_data._deleted)
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

export const upcomingEventsByDataViewState = atom((get) => {
  const events = get(upcomingEventsActiveState);
  const dataView = get(userDataViewState);

  return events.filter((record) => {
    if (dataView === 'main') {
      return record.event_data.type === 'main';
    }

    return (
      record.event_data.type === 'main' || record.event_data.type === dataView
    );
  });
});
