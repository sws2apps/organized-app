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
  KingdomInauguration,
  LanguageCourse,
  AnnualMeeting,
  Custom,
}

export type UpcomingEventType = {
  event_uid: string;
  date: { value: Date; updatedAt: string };
  time: { value: Date; updatedAt: string };
  type: { value: UpcomingEventCategory; updatedAt: string };
  additional: { value: string; updatedAt: string };
  custom?: { value: string; updatedAt: string };
  _deleted: { value: boolean; updatedAt: string };
};
