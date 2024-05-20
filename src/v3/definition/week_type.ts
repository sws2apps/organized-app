import { Week } from './sources';

export type WeekType = {
  id: Week;
  sort_index: number;
  week_type_name: {
    [language: string]: string;
  };
};
