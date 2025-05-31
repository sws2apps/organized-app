import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import { AssignmentCode } from '@definition/assignment';
import { settingsState, userDataViewState } from '@states/settings';

const useMyProfile = () => {
  const { person } = useCurrentUser();

  const isConnected = useAtomValue(congAccountConnectedState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const hoursCreditEnabled = useMemo(() => {
    if (!person) return false;

    const found =
      person.person_data.assignments
        .find((a) => a.type === dataView)
        ?.values.includes(AssignmentCode.MINISTRY_HOURS_CREDIT) ?? false;

    return found;
  }, [person, dataView]);

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
