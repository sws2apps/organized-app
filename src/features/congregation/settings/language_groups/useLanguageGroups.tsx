import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@hooks/index';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { languageGroupEnabledState, userDataViewState } from '@states/settings';
import { congAccountConnectedState, congregationUsersState } from '@states/app';
import { languageGroupsState } from '@states/field_service_groups';

const useLanguageGroups = () => {
  const { isAdmin } = useCurrentUser();

  const isConnected = useAtomValue(congAccountConnectedState);
  const dataView = useAtomValue(userDataViewState);

  const { data: users } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
    enabled: isConnected && isAdmin,
  });

  const setUsers = useSetAtom(congregationUsersState);

  const enabled = useAtomValue(languageGroupEnabledState);
  const languageGroups = useAtomValue(languageGroupsState);

  const fullAccess = useMemo(() => {
    return dataView === 'main';
  }, [dataView]);

  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => setIsAdd(true);

  const handleCloseAdd = () => setIsAdd(false);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      setUsers(users);
    }
  }, [setUsers, users]);

  return {
    enabled,
    isAdd,
    handleOpenAdd,
    handleCloseAdd,
    languageGroups,
    fullAccess,
  };
};

export default useLanguageGroups;
