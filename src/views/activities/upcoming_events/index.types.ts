import { UpcomingEventDataType } from '@definition/upcoming_events';

export type TemplateUpcomingEventsProps = {
  events: UpcomingEventDataType[][];
  lang: string;
  congregation: string;
};

export type UpcomingEventsListProps = {
  events: UpcomingEventDataType[][];
};

export type UpcomingEventProps = {
  event: UpcomingEventDataType;
};

export type UpcomingEventDateProps = {
  date?: string;
  day?: string;
  title: string;
  description?: string;
  range?: string;
};
