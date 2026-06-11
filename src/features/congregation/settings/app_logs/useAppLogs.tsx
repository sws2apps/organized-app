import { useEffect, useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { AppLogEntryType, AppLogFilterType } from '@definition/app_logs';
import { dbAppLogsGetAll } from '@services/dexie/app_logs';
import { userLocalUIDState } from '@states/settings';

const ADMIN_ROLES = ['admin', 'coordinator', 'secretary'];

const useAppLogs = () => {
  const [allLogs, setAllLogs] = useState<AppLogEntryType[]>([]);
  const [filter, setFilter] = useState<AppLogFilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  const currentUserUID = useAtomValue(userLocalUIDState);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const logs = await dbAppLogsGetAll();
      setAllLogs(logs);
    } catch {
      setAllLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = allLogs.filter((entry) => {
    if (filter === 'mine') {
      return entry.actor_uid === currentUserUID;
    }
    if (filter === 'admins') {
      return entry.actor_roles.some((r) => ADMIN_ROLES.includes(r));
    }
    if (filter === 'others') {
      return !entry.actor_roles.some((r) => ADMIN_ROLES.includes(r));
    }
    return true;
  });

  return {
    logs: filteredLogs,
    filter,
    setFilter,
    isLoading,
    reload: loadLogs,
    totalCount: allLogs.length,
  };
};

export default useAppLogs;
