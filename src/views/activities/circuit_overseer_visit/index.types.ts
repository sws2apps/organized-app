import { UpcomingEventDataType } from '@definition/upcoming_events';

export type TemplateCircuitOverseerVisitProps = {
  title: string;
  congregation: string;
  lang: string;
  events: UpcomingEventDataType[];
};
