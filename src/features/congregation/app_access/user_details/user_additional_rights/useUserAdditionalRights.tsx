import { useEffect, useState } from 'react';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';

const useUserAdditionalRights = () => {
  const { handleSaveDetails, user } = useUserDetails();

  const [isMidweek, setIsMidweek] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isPublicTalk, setIsPublicTalk] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);

  const handleToggleMidweek = async (value: boolean) => {
    try {
      setIsMidweek(value);

      const newUser = structuredClone(user);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('midweek_schedule');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'midweek_schedule'
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

  const handleToggleWeekend = async (value: boolean) => {
    try {
      setIsWeekend(value);

      const newUser = structuredClone(user);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('weekend_schedule');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'weekend_schedule'
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

  const handleTogglePublicTalk = async (value: boolean) => {
    try {
      setIsPublicTalk(value);

      const newUser = structuredClone(user);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('public_talk_schedule');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'public_talk_schedule'
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

  const handleToggleAttendance = async (value: boolean) => {
    try {
      setIsAttendance(value);

      const newUser = structuredClone(user);

      newUser.profile.cong_role = newUser.profile.cong_role || [];

      if (value) {
        newUser.profile.cong_role.push('attendance_tracking');
      }

      if (!value) {
        newUser.profile.cong_role = newUser.profile.cong_role.filter(
          (role) => role !== 'attendance_tracking'
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
    const isMidweek =
      user.profile.cong_role?.includes('midweek_schedule') ?? false;
    setIsMidweek(isMidweek);

    const isWeekend =
      user.profile.cong_role?.includes('weekend_schedule') ?? false;
    setIsWeekend(isWeekend);

    const isPublicTalk =
      user.profile.cong_role?.includes('public_talk_schedule') ?? false;
    setIsPublicTalk(isPublicTalk);

    const isAttendance =
      user.profile.cong_role?.includes('attendance_tracking') ?? false;
    setIsAttendance(isAttendance);
  }, [user]);

  return {
    isMidweek,
    handleToggleMidweek,
    isWeekend,
    handleToggleWeekend,
    isPublicTalk,
    handleTogglePublicTalk,
    isAttendance,
    handleToggleAttendance,
  };
};

export default useUserAdditionalRights;
