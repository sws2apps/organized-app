export enum UpcomingEventType {
  CircuitOverseerWeek,
  PioneerWeek,
  MemorialWeek,
  ConventionWeek,
  AssemblyWeek,
  InternationalConventionWeek,
  SpecialCampaignWeek,
  TheocraticTrainingWeek,
  HallMaintenanceTrainingWeek,
  BethelTour,
  CongregationTrip,
  SpecialProgram,
  PublicWitnessing,
  KingdomInnauguration,
  LanguageCourse,
  AnnualMeeting,
  Custom,
}

export type UpcomingEventContentType = {
  time: { value: Date; updatedAt: string };
  type: { value: UpcomingEventType; updatedAt: string };
  additional: { value: string; updatedAt: string };
  custom?: { value: string; updatedAt: string };
  _deleted: { value: boolean; updatedAt: string };
};

export type DateUpcomingEventType = {
  date: Date;
  events: UpcomingEventContentType[];
};

export type YearlyUpcomingEventType = {
  year: string;
  dates: DateUpcomingEventType[];
};

export type UpcomingEventsWrapperType = {
  id: number;
  years: YearlyUpcomingEventType[];
};
