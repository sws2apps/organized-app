export interface EventType {
  time: string;
  icon: string;
  title: string;
  description?: string;
}

export interface EventDateType {
  date: number;
  events: EventType[];
}

export interface YearlyEventsType {
  year: string;
  dates: EventDateType[];
}

export type EventListType = YearlyEventsType[];
