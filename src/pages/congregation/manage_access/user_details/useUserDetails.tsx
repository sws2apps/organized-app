import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';
import { congregationUsersState, userIDState } from '@states/app';

const useUserDetails = () => {
  const { id } = useParams();

  const users = useRecoilValue(congregationUsersState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const userID = useRecoilValue(userIDState);

  const user = useMemo(() => {
    return users.find((record) => record.id === id);
  }, [id, users]);

  const [isDelete, setIsDelete] = useState(false);

  const deleteDisabled = useMemo(() => {
    return userID === user?.id;
  }, [userID, user]);

  const handleOpenDelete = () => setIsDelete(true);

  const handleCloseDelete = () => setIsDelete(false);

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
