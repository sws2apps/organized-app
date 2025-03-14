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
  time: Date;
  type: UpcomingEventType;
  additional: string;
  custom?: string;
  _deleted: boolean;
  updatedAt: string;
};

export type DateUpcomingEventType = {
  date: Date;
  events: UpcomingEventContentType[];
};

export type YearlyUpcomingEventType = {
  year: string;
  dates: DateUpcomingEventType[];
};
