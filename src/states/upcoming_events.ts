/*
This file holds the source of the truth from the table "upcoming_events".
*/

import { atom } from 'jotai';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
  UpcomingEventType,
} from '@definition/upcoming_events';
import { addDays, formatDate, getWeekDate } from '@utils/date';
import { userDataViewState } from './settings';
import { circuitOverseerVisitsState } from './circuit_overseer_visit';

export const upcomingEventsDbState = atom<UpcomingEventType[]>([]);

// Circuit overseer visits are listed from their dates, replacing any
// manually added event for the same week.
const circuitOverseerVisitEventsState = atom((get) =>
  get(circuitOverseerVisitsState).map(
    (visit): UpcomingEventType => ({
      event_uid: visit.id,
      event_data: {
        _deleted: false,
        updatedAt: visit.updatedAt,
        start: new Date(visit.weekOf).toISOString(),
        end: addDays(visit.weekOf, 6).toISOString(),
        type: 'main',
        category: UpcomingEventCategory.CircuitOverseerWeek,
        duration: UpcomingEventDuration.MultipleDays,
        wholeDay: true,
        description: '',
      },
    })
  )
);

export const upcomingEventsState = atom((get) => {
  const visitEvents = get(circuitOverseerVisitEventsState);

  const visitWeeks = new Set(
    visitEvents.map((record) =>
      formatDate(new Date(record.event_data.start), 'yyyy/MM/dd')
    )
  );

  const events = get(upcomingEventsDbState).filter((record) => {
    if (record.event_data._deleted) return false;

    if (
      record.event_data.category !== UpcomingEventCategory.CircuitOverseerWeek
    ) {
      return true;
    }

    const weekOf = formatDate(
      getWeekDate(new Date(record.event_data.start)),
      'yyyy/MM/dd'
    );

    return !visitWeeks.has(weekOf);
  });

  return [...events, ...visitEvents].sort((a, b) =>
    a.event_data.start.localeCompare(b.event_data.start)
  );
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
