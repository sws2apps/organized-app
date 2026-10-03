import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { AppLogEntryType, AppLogFilterType } from '@definition/app_logs';
import { dbAppLogsGetAll } from '@services/dexie/app_logs';
import { LOG_ADMIN_ROLES } from '@services/app/app_logs';
import { userLocalUIDState } from '@states/settings';

const isAdminRole = (entry: AppLogEntryType) =>
  entry.actor_roles.some((role) => LOG_ADMIN_ROLES.includes(role));

const useActivityHistory = () => {
  const [allLogs, setAllLogs] = useState<AppLogEntryType[]>([]);
  const [filter, setFilter] = useState<AppLogFilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  const currentUserUID = useAtomValue(userLocalUIDState);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      setAllLogs(await dbAppLogsGetAll());
    } catch {
      setAllLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const logs = useMemo(() => {
    switch (filter) {
      case 'mine':
        return allLogs.filter((entry) => entry.actor_uid === currentUserUID);
      case 'admins':
        return allLogs.filter(isAdminRole);
      case 'others':
        return allLogs.filter((entry) => !isAdminRole(entry));
      default:
        return allLogs;
    }
  }, [allLogs, filter, currentUserUID]);

  return { logs, filter, setFilter, isLoading, totalCount: allLogs.length };
};

export default useActivityHistory;
