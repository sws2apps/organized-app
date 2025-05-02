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
  _deleted: boolean;
  updatedAt: string;
  event_data: {
    start_time: string;
    end_time: string;
    scope: string;
    type: UpcomingEventCategory;
    additional: string;
    custom?: string;
  };
};
