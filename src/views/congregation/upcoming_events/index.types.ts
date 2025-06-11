import { UpcomingEventType } from '@definition/upcoming_events';

export type TemplateUpcomingEventsProps = {
  events: UpcomingEventType[];
  shortDateFormat: string;
  lang: string;
  congregation: string;
};

export type UpcomingEventsListProps = {
  events: UpcomingEventType[];
};

export type UpcomingEventProps = {
  event: UpcomingEventType;
};

export type UpcomingEventDateProps = {
  date: Date;
  title: string;
  description?: string;
  dayIndicatorText?: string;
};
