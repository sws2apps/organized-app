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

export type UpcomingEventDateType = {
  start: string;
  end: string;
  comment: string;
};

export type UpcomingEventType = {
  event_uid: string;
  _deleted: boolean;
  updatedAt: string;
  event_data: {
    event_dates: UpcomingEventDateType[];
    scope: string;
    type: UpcomingEventCategory;
    description: string;
    custom?: string;
  };
};
