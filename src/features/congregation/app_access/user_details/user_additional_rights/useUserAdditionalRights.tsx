import { useEffect, useState } from 'react';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';

const useUserAdditionalRights = () => {
  const { handleSaveDetails, currentUser } = useUserDetails();

  const [isMidweek, setIsMidweek] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isPublicTalk, setIsPublicTalk] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const isHallInfoEditor =
    currentUser?.profile.cong_role?.includes('hall_attendant_info') ?? false;
  const handleToggleHallInfo = async (value: boolean) => {
    try {
      if (!currentUser) return;
      const next = structuredClone(currentUser);
      next.profile.cong_role = (next.profile.cong_role ?? []).filter(
        (role) => role !== 'hall_attendant_info'
      );
      if (value) next.profile.cong_role.push('hall_attendant_info');
      await handleSaveDetails(next);
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : 'error_app_generic-desc'
        ),
        severity: 'error',
      });
    }
  };

  const handleToggleMidweek = async (value: boolean) => {
    try {
      setIsMidweek(value);

      const newUser = structuredClone(currentUser);

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

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleWeekend = async (value: boolean) => {
    try {
      setIsWeekend(value);

      const newUser = structuredClone(currentUser);

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

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleTogglePublicTalk = async (value: boolean) => {
    try {
      setIsPublicTalk(value);

      const newUser = structuredClone(currentUser);

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

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleAttendance = async (value: boolean) => {
    try {
      setIsAttendance(value);

      const newUser = structuredClone(currentUser);

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

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const isMidweek =
      currentUser.profile.cong_role?.includes('midweek_schedule') ?? false;
    setIsMidweek(isMidweek);

    const isWeekend =
      currentUser.profile.cong_role?.includes('weekend_schedule') ?? false;
    setIsWeekend(isWeekend);

    const isPublicTalk =
      currentUser.profile.cong_role?.includes('public_talk_schedule') ?? false;
    setIsPublicTalk(isPublicTalk);

    const isAttendance =
      currentUser.profile.cong_role?.includes('attendance_tracking') ?? false;
    setIsAttendance(isAttendance);
  }, [currentUser]);

  return {
    isHallInfoEditor,
    handleToggleHallInfo,
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
