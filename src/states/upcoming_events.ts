/*
This file holds the source of the truth from the table "upcoming_events".
*/

import { atom } from 'jotai';
import { UpcomingEventType } from '@definition/upcoming_events';

export const upcomingEventsState = atom<UpcomingEventType[]>([]);
