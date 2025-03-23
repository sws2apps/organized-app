/*
This file holds the source of the truth from the table "upcoming_events".
*/
import { UpcomingEventType } from '@definition/upcoming_events';
import { atom } from 'recoil';

export const upcomingEventsState = atom<UpcomingEventType[]>({
  key: 'upcomingEvents',
  default: [],
});
