export enum UpcomingEventСategory {
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

export type UpcomingEventType = {
  id: number;
  date: { value: Date; updatedAt: string };
  time: { value: Date; updatedAt: string };
  type: { value: UpcomingEventСategory; updatedAt: string };
  additional: { value: string; updatedAt: string };
  custom?: { value: string; updatedAt: string };
  _deleted: { value: boolean; updatedAt: string };
};
