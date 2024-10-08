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
  const { data } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
  });

  const setUsers = useSetRecoilState(congregationUsersState);

  const congregationsPersons = useRecoilValue(congregationsPersonsState);
  const appAdmin = useRecoilValue(congregationsAppAdminState);
  const baptizedPersons = useRecoilValue(congregationsBaptizedPersonsState);
  const settings = useRecoilValue(settingsState);

  const sync_disabled = useMemo(() => {
    return !settings.cong_settings.data_sync.value;
  }, [settings.cong_settings.data_sync.value]);

  const [userAddOpen, setUserAddOpen] = useState(false);

  const handleOpenUserAdd = () => setUserAddOpen(true);

  const handleCloseUserAdd = () => setUserAddOpen(false);

  useEffect(() => {
    if (Array.isArray(data?.users)) {
      setUsers(data.users);
    }
  }, [data, setUsers]);

  return {
    userAddOpen,
    handleOpenUserAdd,
    handleCloseUserAdd,
    congregationsPersons,
    baptizedPersons,
    appAdmin,
    sync_disabled,
  };
};

export default useAllUsers;
