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
  CongregationTrip,
  SpecialProgram,
  PublicWitnessing,
  KingdomDedication,
  LanguageCourse,
  AnnualMeeting,
  Custom,
}

export type UpcomingEventType = {
  event_uid: string;
  date: Date;
  time: Date;
  type: UpcomingEventCategory;
  additional: string;
  custom?: string;
  _deleted: boolean;
  updatedAt: string;
};
