import { useEffect, useState } from 'react';
import { CongregationUserType } from '@definition/api';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';

const useUserAdditionalRights = (user: CongregationUserType) => {
  const { t } = useAppTranslation();

  const { handleSaveDetails } = useUserDetails();

  const [isMidweek, setIsMidweek] = useState(false);
  const [isPublicTalk, setIsPublicTalk] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);

  const handleToggleMidweek = async (value: boolean) => {
    try {
      setIsMidweek(value);

      if (value) {
        user.cong_role.push('midweek_schedule');
      }

      if (!value) {
        user.cong_role = user.cong_role.filter(
          (role) => role !== 'midweek_schedule'
        );
      }

      await handleSaveDetails(user);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleTogglePublicTalk = async (value: boolean) => {
    try {
      setIsPublicTalk(value);

      if (value) {
        user.cong_role.push('public_talk_schedule');
      }

      if (!value) {
        user.cong_role = user.cong_role.filter(
          (role) => role !== 'public_talk_schedule'
        );
      }

      await handleSaveDetails(user);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleToggleAttendance = async (value: boolean) => {
    try {
      setIsAttendance(value);

      if (value) {
        user.cong_role.push('attendance_tracking');
      }

      if (!value) {
        user.cong_role = user.cong_role.filter(
          (role) => role !== 'attendance_tracking'
        );
      }

      await handleSaveDetails(user);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const isMidweek = user.cong_role.includes('midweek_schedule');
    setIsMidweek(isMidweek);

    const isPublicTalk = user.cong_role.includes('public_talk_schedule');
    setIsPublicTalk(isPublicTalk);

    const isAttendance = user.cong_role.includes('attendance_tracking');
    setIsAttendance(isAttendance);
  }, [user]);

  return {
    isMidweek,
    handleToggleMidweek,
    isPublicTalk,
    handleTogglePublicTalk,
    isAttendance,
    handleToggleAttendance,
  };
};

export default useUserAdditionalRights;
