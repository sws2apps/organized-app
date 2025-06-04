import { UpcomingEventType } from '@definition/upcoming_events';

export type TemplateUpcomingEventsType = {
  events: UpcomingEventType[];
  shortDateFormat: string;
  lang: string;
  congregation: string;
};

export type UpcomingEventsListType = {
  events: UpcomingEventType[];
};

export type TemplateUpcomingEventType = {
  event: UpcomingEventType;
};
