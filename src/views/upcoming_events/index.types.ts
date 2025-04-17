import { UpcomingEventType } from '@definition/upcoming_events';

export type TemplateUpcomingEventsType = {
  events: UpcomingEventType[];
  congregation: string;
  lang: string;
  use24: boolean;
};

export type PageHeaderType = {
  congregation: string;
};

export type UpcomingEventsListType = {
  events: UpcomingEventType[];
  use24: boolean;
};

export type YearlyUpcomingEventsType = UpcomingEventsListType;
export type DateWithUpcomingEventsType = UpcomingEventsListType;

export type UpcomingEventPDFType = {
  event: UpcomingEventType;
  use24: boolean;
};
