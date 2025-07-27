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

export enum UpcomingEventDuration {
  SingleDay,
  MultipleDays,
}

export type UpcomingEventType = {
  event_uid: string;
  _deleted: boolean;
  updatedAt: string;
  event_data: {
    start: string;
    end: string;
    type: string;
    category: UpcomingEventCategory;
    duration: UpcomingEventDuration;
    description: string;
    custom?: string;
  };
};
