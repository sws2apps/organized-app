import { UpcomingEventType } from '@definition/upcoming_events';

export type TemplateUpcomingEventsType = {
  events: UpcomingEventType[];
  congregation: string;
  lang: string;
};

export type PageHeaderType = {
  congregation: string;
};

export type UpcomingEventsListType = {
  events: UpcomingEventType[];
};

export type YearlyUpcomingEventsType = UpcomingEventsListType;
