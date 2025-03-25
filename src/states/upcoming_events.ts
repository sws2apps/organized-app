/*
This file holds the source of the truth from the table "upcoming_events".
*/
import { UpcomingEventType } from '@definition/upcoming_events';
import { atom, selector } from 'recoil';

export const upcomingEventsState = atom<UpcomingEventType[]>({
  key: 'upcomingEvents',
  default: [],
});

export const upcomingEventsInScopeState = selector({
  key: 'upcomingEventsInScope',
  get: ({ get }) => {
    const upcomingEvents = get(upcomingEventsState);

    return upcomingEvents.filter((event) => event.scope !== '');
  },
});
