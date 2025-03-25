export enum UpcomingEventCategory {
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
  SpecialProgram,
  PublicWitnessing,
  KingdomDedication,
  LanguageCourse,
  AnnualMeeting,
  Custom,
}

export type UpcomingEventType = {
  event_uid: string;
  date: string;
  time: string;
  scope: string;
  type: UpcomingEventCategory;
  additional: string;
  custom?: string;
  _deleted: boolean;
  updatedAt: string;
};
