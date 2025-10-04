import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { userIDState } from '@states/app';
import { congregationUsersState } from '@states/congregation';

const useUserDetails = () => {
  const { id } = useParams();

  const users = useAtomValue(congregationUsersState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userID = useAtomValue(userIDState);

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
