import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { APICongregationUserType, CongregationUserType } from '@definition/api';
import { fullnameOptionState } from '@states/settings';
import { refreshScreenState, userIDState } from '@states/app';

const useUserDetails = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const forceRefresh = useRecoilValue(refreshScreenState);
  const userID = useRecoilValue(userIDState);

  const [user, setUser] = useState<CongregationUserType>(null);
  const [isDelete, setIsDelete] = useState(false);

  const deleteDisabled = userID === user?.id;

  const handleOpenDelete = () => setIsDelete(true);

  const handleCloseDelete = () => setIsDelete(false);

  useEffect(() => {
    const congregation_users: APICongregationUserType =
      queryClient.getQueryData(['congregation_users']);

    const user = congregation_users.users.find((record) => record.id === id);

    setUser(structuredClone(user));
  }, [id, forceRefresh, queryClient]);

  return {
    user,
    fullnameOption,
    deleteDisabled,
    isDelete,
    handleOpenDelete,
    handleCloseDelete,
  };
};

export default useUserDetails;
