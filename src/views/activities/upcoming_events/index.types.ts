import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';

export type TemplateUpcomingEventType = {
  year: number;
  eventDaysCountIndicator: string;
  time: string;
  dates: Date[];
  type: string;
  custom: string;
  description: string;
  category: UpcomingEventCategory;
  duration: UpcomingEventDuration;
  start: string;
};

export type TemplateUpcomingEventsProps = {
  events: TemplateUpcomingEventType[][];
  shortDateFormat: string;
  lang: string;
  congregation: string;
};

export type UpcomingEventsListProps = {
  events: TemplateUpcomingEventType[][];
};

export type UpcomingEventProps = {
  event: TemplateUpcomingEventType;
};

export type UpcomingEventDateProps = {
  date: Date;
  title: string;
  description?: string;
  dayIndicatorText?: string;
};
