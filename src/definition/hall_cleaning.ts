import type { SettingsType } from '@definition/settings';

export type HallCleaningConfig = NonNullable<
  SettingsType['cong_settings']['hall_cleaning']
>[number];
export type HallCleaningChanges = {
  [K in Exclude<keyof HallCleaningConfig, 'type' | '_deleted'>]?: NonNullable<
    HallCleaningConfig[K]
  >['value'];
};

export type CleaningActivity =
  | 'major_cleaning'
  | 'grounds_care'
  | 'cleaning_and_grounds';

export type MajorCleaningEvent = {
  id: string;
  type: string;
  date: string;
  activity?: CleaningActivity;
  participants: { id: string; name: string }[];
  coordinator: string;
  notes: string;
  seriesId?: string;
  intervalMonths?: number;
  updatedAt: string;
  deleted?: boolean;
};

export type MajorCleaningUpdate = {
  weekOf: string;
  event: MajorCleaningEvent;
};

export type HallCleaningLoad = Map<string, { count: number; last: string }>;
