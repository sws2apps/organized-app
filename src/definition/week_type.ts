import { MeetingType } from './app';

export enum Week {
  NORMAL = 1,
  CO_VISIT = 2,
  ASSEMBLY = 3,
  CONVENTION = 4,
  MEMORIAL = 5,
  SPECIAL_TALK = 6,
  TREASURES_PART = 7,
  TREASURES_STUDENTS = 8,
  STUDENTS_ASSIGNMENTS = 9,
  STUDENTS_LIVING = 10,
  LIVING_PART = 11,
  PUBLIC_TALK = 12,
  WATCHTOWER_STUDY = 13,
  SPECIAL_TALK_ONLY = 14,
  NO_MEETING = 20,
}

export type WeekType = {
  id: Week;
  sort_index: number;
  language_group: boolean;
  meeting?: MeetingType[];
  week_type_name: {
    [language: string]: string;
  };
};

export type WeekTypeLocale = {
  id: Week;
  sort_index: number;
  language_group: boolean;
  meeting?: MeetingType[];
  week_type_name: string;
};
