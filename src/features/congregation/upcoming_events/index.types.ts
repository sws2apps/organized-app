export type eventValue =
  | 'tr_circuitOverseerWeek'
  | 'tr_pioneerWeek'
  | 'tr_memorialWeek'
  | 'tr_conventionWeek'
  | 'tr_assemblyWeek'
  | 'tr_internationalConventionWeek'
  | 'tr_specialCampaignWeek'
  | 'tr_theocraticTrainingWeek'
  | 'tr_hallMaintenanceTrainingWeek'
  | 'tr_bethelTour'
  | 'tr_congregationTrip'
  | 'tr_specialProgram'
  | 'tr_publicWitnessing'
  | 'tr_kingdomInauguration'
  | 'tr_languageCourse'
  | 'tr_annualMeeting'
  | 'tr_custom';

export interface EventType {
  time: string;
  type: eventValue;
  // used for "tr_custom" event type, to add a custom title
  title?: string;
  description?: string;
}

export interface EventDateType {
  date: number;
  events: EventType[];
}

export interface YearlyEventsType {
  year: string;
  dates: EventDateType[];
}

export type EventListType = YearlyEventsType[];
