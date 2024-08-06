import { MeetingType } from './app';

export enum Week {
  NORMAL = 1,
  CO_VISIT = 2,
  ASSEMBLY = 3,
  CONVENTION = 4,
  MEMORIAL = 5,
  SPECIAL_TALK = 6,
  NO_MEETING = 20,
}

export type WeekType = {
  id: Week;
  sort_index: number;
  meeting?: MeetingType[];
  week_type_name: {
    [language: string]: string;
  };
};

export type WeekTypeLocale = {
  id: Week;
  sort_index: number;
  meeting?: MeetingType[];
  week_type_name: string;
};
