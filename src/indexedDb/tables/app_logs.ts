import { Table } from 'dexie';
import { AppLogEntryType } from '@definition/app_logs';

export type AppLogsTable = {
  app_logs: Table<AppLogEntryType>;
};

// Indexed on id (primary) and updatedAt (the only sorted query — newest first).
// Filtering (actor, module, roles) runs client-side over the pruned in-memory
// set, so no secondary indexes are needed.
export const appLogsSchema = {
  app_logs: '&id, updatedAt',
};
