import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { APICongregationUserType } from '@definition/api';
import { fullnameOptionState } from '@states/settings';
import { userIDState } from '@states/app';
import { currentCongregationUserState } from '@states/congregation';

const useUserDetails = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const currentUser = useMemo(() => {
    const congregation_users: APICongregationUserType =
      queryClient.getQueryData(['congregation_users']);

    return congregation_users.users.find((record) => record.id === id);
  }, [id, queryClient]);

  const [user, setUser] = useRecoilState(currentCongregationUserState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const userID = useRecoilValue(userIDState);

  const [isDelete, setIsDelete] = useState(false);

  const deleteDisabled = useMemo(() => {
    return userID === user?.id;
  }, [userID, user]);

  const handleOpenDelete = () => setIsDelete(true);

  const handleCloseDelete = () => setIsDelete(false);

  useEffect(() => {
    setUser(currentUser);
  }, [setUser, currentUser]);

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
