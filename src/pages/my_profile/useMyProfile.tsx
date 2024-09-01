import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import { AssignmentCode } from '@definition/assignment';

const useMyProfile = () => {
  const { person } = useCurrentUser();

  const isConnected = useRecoilValue(congAccountConnectedState);

  const hoursCreditEnabled = useMemo(() => {
    const find = person.person_data.assignments.find(
      (record) =>
        record._deleted === false &&
        record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );

    return find ? true : false;
  }, [person]);

  const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsLogoutConfirm(false);
  };

  return {
    isLogoutConfirm,
    handleOpenLogoutConfirm,
    handleCloseConfirm,
    isConnected,
    hoursCreditEnabled,
  };
};

export default useMyProfile;
