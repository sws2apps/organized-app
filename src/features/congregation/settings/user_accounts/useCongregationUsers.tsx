import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { congregationUsersState } from '@states/congregation';

/**
 * Reads the accounts of the congregation.
 *
 * It belongs to the tab that shows them rather than to the settings page: the
 * request is made when a user opens that tab, and never merely because the
 * settings were opened.
 */
const useCongregationUsers = () => {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
  });

  const setUsers = useSetAtom(congregationUsersState);

  useEffect(() => {
    if (!isFetching && data && Array.isArray(data)) {
      setUsers(data);
    }
  }, [isFetching, data, setUsers]);

  return { isLoading };
};

export default useCongregationUsers;
