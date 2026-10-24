import { Table } from 'dexie';
import { AppLocalType } from '@definition/app_local';

export type AppLocalsTable = {
  app_locals: Table<AppLocalType>;
};

export const appLocalsSchema = {
  app_locals: '&id',
};