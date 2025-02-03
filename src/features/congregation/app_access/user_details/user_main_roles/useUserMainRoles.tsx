import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userIDState } from '@states/app';
import useUserDetails from '../useUserDetails';

const useUserMainRoles = () => {
  const { handleSaveDetails, currentUser } = useUserDetails();

  const userID = useRecoilValue(userIDState);

  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isServiceOverseer, setIsServiceOverseer] = useState(false);

  const handleToggleAdmin = async (value: boolean) => {
    try {
      if (userID !== currentUser.id) {
        setIsAdmin(value);

        const newUser = structuredClone(currentUser);

        newUser.profile.cong_role = newUser.profile.cong_role || [];

        if (value) {
          newUser.profile.cong_role.push('admin');
        }

        if (!value) {
          newUser.profile.cong_role = newUser.profile.cong_role.filter(
            (role) => role !== 'admin'
          );
        }

        await handleSaveDetails(newUser);
      }
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleCoordinator = async (value: boolean) => {
    try {
      setIsCoordinator(value);

      const newUser = structuredClone(currentUser);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('coordinator');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'coordinator'
        );
      }

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleSecretary = async (value: boolean) => {
    try {
      setIsSecretary(value);

      const newUser = structuredClone(currentUser);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('secretary');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'secretary'
        );
      }

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleServiceOverseer = async (value: boolean) => {
    try {
      setIsServiceOverseer(value);

      const newUser = structuredClone(currentUser);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('service_overseer');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'service_overseer'
        );
      }

      await handleSaveDetails(newUser);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const isCoordinator =
      currentUser.profile.cong_role?.includes('coordinator') ?? false;
    setIsCoordinator(isCoordinator);

    const isSecretary =
      currentUser.profile.cong_role?.includes('secretary') ?? false;
    setIsSecretary(isSecretary);

    const isAdmin = currentUser.profile.cong_role?.includes('admin') ?? false;
    setIsAdmin(isAdmin);

    const isFieldOverseer =
      currentUser.profile.cong_role?.includes('service_overseer') ?? false;
    setIsServiceOverseer(isFieldOverseer);
  }, [currentUser]);

  return {
    isAdmin,
    handleToggleAdmin,
    isCoordinator,
    handleToggleCoordinator,
    isSecretary,
    isServiceOverseer,
    handleToggleSecretary,
    handleToggleServiceOverseer,
  };
};

export default useUserMainRoles;
