import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { congregationUsersState } from '@states/app';

const useAllUsers = () => {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
  });

  const setUsers = useSetRecoilState(congregationUsersState);

  const [userAddOpen, setUserAddOpen] = useState(false);

  const handleOpenUserAdd = () => setUserAddOpen(true);

  const handleCloseUserAdd = () => setUserAddOpen(false);

  useEffect(() => {
    if (!isFetching && data && Array.isArray(data)) {
      setUsers(data);
    }
  }, [isFetching, data, setUsers]);

  return {
    userAddOpen,
    handleCloseUserAdd,
    isLoading,
    handleOpenUserAdd,
  };
};

export default useAllUsers;
