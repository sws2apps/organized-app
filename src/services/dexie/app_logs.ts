import appDb from '@db/appDb';
import { AppLogEntryType } from '@definition/app_logs';
import { AppRoleType } from '@definition/app';

/**
 * Reads the current user info directly from the DB (non-reactive, safe for service layer).
 */
const getCurrentActorInfo = async (): Promise<{
  actor_uid: string;
  actor_name: string;
  actor_roles: AppRoleType[];
}> => {
  try {
    const settings = await appDb.app_settings.get(1);
    if (!settings) {
      return { actor_uid: '', actor_name: 'Unknown', actor_roles: [] };
    }

    const uid = settings.user_settings.user_local_uid ?? '';
    const first = settings.user_settings.firstname?.value ?? '';
    const last = settings.user_settings.lastname?.value ?? '';
    const name = [first, last].filter(Boolean).join(' ') || 'Unknown';
    const roles = settings.user_settings.cong_role ?? [];

    return { actor_uid: uid, actor_name: name, actor_roles: roles };
  } catch {
    return { actor_uid: '', actor_name: 'Unknown', actor_roles: [] };
  }
};

/**
 * Writes a new log entry. Non-blocking — call without await where desired.
 */
export const dbAppLogCreate = async (
  entry: Omit<AppLogEntryType, 'id' | 'updatedAt' | 'actor_uid' | 'actor_name' | 'actor_roles'>
): Promise<void> => {
  try {
    const actor = await getCurrentActorInfo();

    const logEntry: AppLogEntryType = {
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      ...actor,
      ...entry,
    };

    await appDb.app_logs.put(logEntry);

    // Housekeeping: prune entries older than the 1st of last month
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const cutoffISO = cutoff.toISOString();

    const expired = await appDb.app_logs
      .where('updatedAt')
      .below(cutoffISO)
      .toArray();

    if (expired.length > 0) {
      await appDb.app_logs.bulkDelete(expired.map((e) => e.id));
    }
  } catch (error) {
    console.error('[app_logs] Failed to write log entry', error);
  }
};

/**
 * Retrieves all log entries sorted newest first.
 */
export const dbAppLogsGetAll = async (): Promise<AppLogEntryType[]> => {
  try {
    const entries = await appDb.app_logs.orderBy('updatedAt').reverse().toArray();
    return entries;
  } catch {
    return [];
  }
};

/**
 * Clears all log entries (e.g., on congregation reset).
 */
export const dbAppLogsClear = async (): Promise<void> => {
  try {
    await appDb.app_logs.clear();
  } catch (error) {
    console.error('[app_logs] Failed to clear logs', error);
  }
};
