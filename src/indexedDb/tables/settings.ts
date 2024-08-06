import { Table } from 'dexie';
import { SettingsType } from '@definition/settings';

export type SettingsTable = {
  app_settings: Table<SettingsType>;
};

export const settingsSchema = {
  app_settings: '++id, cong_settings, user_settings',
};
