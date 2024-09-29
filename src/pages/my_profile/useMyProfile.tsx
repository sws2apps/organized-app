import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import { AssignmentCode } from '@definition/assignment';
import { settingsState } from '@states/settings';

const useMyProfile = () => {
  const { person } = useCurrentUser();

  const isConnected = useRecoilValue(congAccountConnectedState);
  const settings = useRecoilValue(settingsState);

  const hoursCreditEnabled = useMemo(() => {
    if (!person) return false;

    const find = person.person_data.assignments.find(
      (record) =>
        record._deleted === false &&
        record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );

    return find ? true : false;
  }, [person]);

  const showTimeAway = useMemo(() => {
    if (!person) return false;

    return settings.cong_settings.data_sync.value;
  }, [person, settings]);

  const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsLogoutConfirm(false);
  };

  return {
    showTimeAway,
    isLogoutConfirm,
    handleOpenLogoutConfirm,
    handleCloseConfirm,
    isConnected,
    hoursCreditEnabled,
  };
};

export default useMyProfile;
