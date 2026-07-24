import appDb from '@db/appDb';
import { store } from '@states/index';
import {
  congRoleState,
  fullnameState,
  userLocalUIDState,
} from '@states/settings';
import { AppLogEntryType } from '@definition/app_logs';
import { AppRoleType } from '@definition/app';

// Keep at most this many entries regardless of date, as a hard backstop against
// unbounded growth from a burst of activity within the retention window.
const RETAIN_MAX = 3000;
const PRUNE_GUARD_KEY = 'app_logs_pruned_on';

/**
 * Reads the acting user from the in-memory jotai store — synchronous and free
 * (no DB round-trip per write), and always current. Honors the congregation's
 * name-display preference via `fullnameState`.
 */
const getCurrentActor = (): Pick<
  AppLogEntryType,
  'actor_uid' | 'actor_name' | 'actor_roles'
> => {
  try {
    return {
      actor_uid: store.get(userLocalUIDState),
      actor_name: store.get(fullnameState) || '',
      actor_roles: (store.get(congRoleState) ?? []) as AppRoleType[],
    };
  } catch {
    return { actor_uid: '', actor_name: '', actor_roles: [] };
  }
};

const today = () => new Date().toISOString().slice(0, 10);

const safeLocalStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode) — pruning just runs more often */
    }
  },
};

/**
 * Housekeeping: drop entries older than the 1st of last month and enforce the
 * hard cap. Runs at most once per day (localStorage-guarded) so it never adds a
 * scan to a normal write, and never throws into the write path.
 */
const pruneExpiredLogs = async (): Promise<void> => {
  try {
    if (safeLocalStorage.get(PRUNE_GUARD_KEY) === today()) return;

    const now = new Date();
    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    ).toISOString();
    await appDb.app_logs.where('updatedAt').below(cutoff).delete();

    const count = await appDb.app_logs.count();
    if (count > RETAIN_MAX) {
      const oldest = await appDb.app_logs
        .orderBy('updatedAt')
        .limit(count - RETAIN_MAX)
        .primaryKeys();
      await appDb.app_logs.bulkDelete(oldest);
    }

    safeLocalStorage.set(PRUNE_GUARD_KEY, today());
  } catch (error) {
    // Pruning is best-effort; a failure must never break logging.
    console.error('[app_logs] prune failed', error);
  }
};

/**
 * Writes a new log entry. Non-blocking and self-contained — call without await;
 * any failure is swallowed so logging can never disrupt a user action.
 */
export const dbAppLogCreate = async (
  entry: Omit<
    AppLogEntryType,
    'id' | 'updatedAt' | 'actor_uid' | 'actor_name' | 'actor_roles'
  >
): Promise<void> => {
  try {
    await appDb.app_logs.put({
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      ...getCurrentActor(),
      ...entry,
    });

    await pruneExpiredLogs();
  } catch (error) {
    console.error('[app_logs] Failed to write log entry', error);
  }
};

/**
 * Retrieves all log entries sorted newest first.
 */
export const dbAppLogsGetAll = async (): Promise<AppLogEntryType[]> => {
  try {
    return await appDb.app_logs.orderBy('updatedAt').reverse().toArray();
  } catch {
    return [];
  }
};
