export enum UpcomingEventCategory {
  CircuitOverseerWeek,
  PioneerWeek,
  MemorialWeek,
  ConventionWeek,
  AssemblyWeek,
  InternationalConventionWeek,
  SpecialCampaignWeek,
  HallMaintenanceTrainingWeek,
  TheocraticTrainingWeek,
  BethelTour,
  SpecialProgram,
  PublicWitnessing,
  KingdomDedication,
  LanguageCourse,
  AnnualMeeting,
  Custom,
}

export enum UpcomingEventDuration {
  SingleDay,
  MultipleDays,
}

export type UpcomingEventDisplayType = 'byDay' | 'range';

export const UPCOMING_EVENT_MAX_LIST_DAYS = 7;

export const DEFAULT_EVENT_START_HOUR = 9;

export type UpcomingEventType = {
  event_uid: string;
  _deleted?: boolean;
  updatedAt?: string;
  event_data: {
    _deleted: boolean;
    updatedAt: string;
    start: string;
    end: string;
    type: string;
    category: UpcomingEventCategory;
    duration: UpcomingEventDuration;
    description: string;
    custom?: string;
    wholeDay?: boolean;
  };
};

export type UpcomingEventDataType = {
  uid: string;
  year: number;
  time: string;
  dates: { date: string; dateFormatted: string; day: string }[];
  custom: string;
  description: string;
  category: UpcomingEventCategory;
  duration: UpcomingEventDuration;
  wholeDay: boolean;
  showAsRange: boolean;
  start: string;
  date: string;
  day: string;
  datesRange?: string;
};
