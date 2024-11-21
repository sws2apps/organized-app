import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { apiCongregationUsersGet } from '@services/api/congregation';
import {
  congregationsAppAdminState,
  congregationsBaptizedPersonsState,
  congregationsPersonsState,
  congregationUsersState,
} from '@states/app';
import { settingsState } from '@states/settings';

const useAllUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
  });

  const setUsers = useSetRecoilState(congregationUsersState);

  const congregationsPersons = useRecoilValue(congregationsPersonsState);
  const appAdmin = useRecoilValue(congregationsAppAdminState);
  const baptizedPersons = useRecoilValue(congregationsBaptizedPersonsState);
  const settings = useRecoilValue(settingsState);

  const sync_enabled = useMemo(() => {
    return settings.cong_settings.data_sync.value;
  }, [settings.cong_settings.data_sync.value]);

  const [userAddOpen, setUserAddOpen] = useState(false);
  const [enableSyncOpen, setEnableSyncOpen] = useState(false);

  const handleCloseUserAdd = () => setUserAddOpen(false);

  const handleCloseEnableSync = () => setEnableSyncOpen(false);

  const handleAction = () => {
    if (sync_enabled) {
      setUserAddOpen(true);
    }

    if (!sync_enabled) {
      setEnableSyncOpen(true);
    }
  };

  const handleContinue = () => {
    setEnableSyncOpen(false);

    if (sync_enabled) {
      setUserAddOpen(true);
    }
  };

  useEffect(() => {
    if (Array.isArray(data?.users)) {
      setUsers(data.users);
    }
  }, [data, setUsers]);

  return {
    userAddOpen,
    handleCloseUserAdd,
    congregationsPersons,
    baptizedPersons,
    appAdmin,
    handleAction,
    handleContinue,
    enableSyncOpen,
    handleCloseEnableSync,
    isLoading,
  };
};

export default useAllUsers;
