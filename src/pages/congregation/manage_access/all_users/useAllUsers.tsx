import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { APICongregationUserType } from '@definition/api';

const useAllUsers = () => {
  const { data } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
  });

  const [userAddOpen, setUserAddOpen] = useState(false);
  const [users, setUsers] = useState<APICongregationUserType['users']>([]);

  const congregationsPersons = users.filter(
    (record) => record.profile.global_role === 'pocket'
  );

  const appAdmin = users.filter((record) =>
    record.profile.cong_role.includes('admin')
  );

  const baptizedPersons = users.filter(
    (record) =>
      record.profile.global_role === 'vip' &&
      !record.profile.cong_role.includes('admin') &&
      !record.profile.cong_role.includes('coordinator')
  );

  const handleOpenUserAdd = () => setUserAddOpen(true);

  const handleCloseUserAdd = () => setUserAddOpen(false);

  useEffect(() => {
    if (Array.isArray(data?.users)) {
      setUsers(data.users);
    }
  }, [data]);

  return {
    userAddOpen,
    handleOpenUserAdd,
    handleCloseUserAdd,
    congregationsPersons,
    baptizedPersons,
    appAdmin,
  };
};

export default useAllUsers;
