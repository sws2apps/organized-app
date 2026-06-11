import { Table } from 'dexie';
import { AppLogEntryType } from '@definition/app_logs';

export type AppLogsTable = {
  app_logs: Table<AppLogEntryType>;
};

// Indexed: id (primary, unique), updatedAt (for sorted queries),
// actor_uid (for "Mine" filter), module (for module filter), action (for action type filter).
// Non-indexed fields (description, field_label, value_before, value_after, actor_name, actor_roles)
// are stored in the record but queried client-side after loading.
export const appLogsSchema = {
  app_logs: '&id, updatedAt, actor_uid, module, action',
};
