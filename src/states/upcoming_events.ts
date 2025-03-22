import { upcomingEventsSchema } from '@services/dexie/schema';
import { atom, selector } from 'recoil';

export const upcomingEventsState = atom({
  key: 'upcomingEvents',
  default: upcomingEventsSchema,
});

export const upcomingEventsYearsState = selector({
  key: 'years',
  get: ({ get }) => {
    const upcomingEvents = get(upcomingEventsState);

    return upcomingEvents.years;
  },
});
