import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { apiCongregationUsersGet } from '@services/api/congregation';
import {
  congregationsAppAdminState,
  congregationsBaptizedPersonsState,
  congregationsPersonsState,
  congregationUsersState,
} from '@states/app';

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
    handleCloseUserAdd,
    congregationsPersons,
    baptizedPersons,
    appAdmin,
    isLoading,
    handleOpenUserAdd,
  };
};

export default useAllUsers;
