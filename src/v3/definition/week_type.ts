export enum Week {
  NORMAL = 1,
  CO_VISIT = 2,
  ASSEMBLY = 3,
  CONVENTION = 4,
}

export type WeekType = {
  id: Week;
  sort_index: number;
  week_type_name: {
    [language: string]: string;
  };
};

export type WeekTypeLocale = {
  id: Week;
  sort_index: number;
  week_type_name: string;
};
