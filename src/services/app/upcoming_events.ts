import { UpcomingEventType } from '@definition/upcoming_events';

export const sortUpcomingEventsByYear = (events: UpcomingEventType[]) => {
  if (events.length === 0) {
    return [[]];
  }

  const tmpStack: Record<number, UpcomingEventType[]> = {};

  events.forEach((event) => {
    if (!event.event_data.date) {
      return;
    }
    const year = new Date(event.event_data.date).getFullYear();

    if (!tmpStack[year]) {
      tmpStack[year] = [];
    }

    tmpStack[year].push(event);
  });

  const keys = Object.keys(tmpStack);

  if (keys.length === 0) {
    return [[]];
  } else if (keys.length === 1) {
    return keys.map((year) => tmpStack[Number(year)]);
  } else {
    return keys
      .toSorted((a, b) => Number(a) - Number(b))
      .map((year) => tmpStack[Number(year)]);
  }
};

export const sortUpcomingEventsByDate = (
  events: UpcomingEventType[]
): UpcomingEventType[][] => {
  if (events.length === 0) {
    return [];
  }
  const tmpStack: Record<number, UpcomingEventType[]> = {};

  events.forEach((event) => {
    if (!event.event_data.date) {
      return;
    }
    const date = new Date(event.event_data.date).getTime();

    if (!tmpStack[date]) {
      tmpStack[date] = [];
    }

    tmpStack[date].push(event);
  });

  const keys = Object.keys(tmpStack);

  if (keys.length === 0) {
    return [];
  } else if (keys.length === 1) {
    return keys.map((year) => tmpStack[Number(year)]);
  } else {
    return keys
      .toSorted((a, b) => Number(a) - Number(b))
      .map((year) => tmpStack[Number(year)]);
  }
};

export const sortUpcomingEventsByTime = (events: UpcomingEventType[]) => {
  return [...events].sort(
    (a, b) =>
      new Date(b.event_data.time).getTime() -
      new Date(a.event_data.time).getTime()
  );
};
