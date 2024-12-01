import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import {
  apiAdminRevokeUserSession,
  apiCongregationUserUpdate,
} from '@services/api/congregation';
import { APICongregationUserType, CongregationUserType } from '@definition/api';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import {
  currentCongregationUserState,
  isProcessingUserState,
} from '@states/congregation';
import { userIDState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';

const useUserDetails = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const [user, setUser] = useRecoilState(currentCongregationUserState);
  const [isProcessing, setIsProcessing] = useRecoilState(isProcessingUserState);

  const userID = useRecoilValue(userIDState);
  const settings = useRecoilValue(settingsState);

  const refetchUser = () => {
    const congregation_users = queryClient.getQueryData([
      'congregation_users',
    ]) as APICongregationUserType;

    const user = congregation_users.users.find((record) => record.id === id);

    if (user) {
      setUser(structuredClone(user));
    }
  };

  const handleSaveDetails = async (
    user: CongregationUserType,
    code?: string
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const { status, message } = await apiCongregationUserUpdate({
        user_id: user.id,
        cong_person_uid: user.profile.user_local_uid || '',
        cong_person_delegates: user.profile.user_members_delegate,
        cong_role: user.profile.cong_role,
        user_secret_code: code,
      });

      if (status !== 200) {
        throw new Error(message);
      }

      // update local record
      if (userID === id) {
        await dbAppSettingsUpdate({
          'user_settings.user_local_uid': user.profile.user_local_uid || '',
          'user_settings.user_members_delegate':
            user.profile.user_members_delegate,
          'user_settings.cong_role': user.profile.cong_role,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['congregation_users'] });
      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

      // update congregation responsabilties
      const data = queryClient.getQueryData([
        'congregation_users',
      ]) as APICongregationUserType;

      const users = data.users;

      const coordinator = users.find((record) =>
        record.profile.cong_role?.includes('coordinator')
      );
      const secretary = users.find((record) =>
        record.profile.cong_role?.includes('secretary')
      );
      const service = users.find((record) =>
        record.profile.cong_role?.includes('service_overseer')
      );

      let updateResp = false;

      if (
        coordinator &&
        coordinator.profile.user_local_uid !==
          settings.cong_settings.responsabilities.coordinator
      ) {
        updateResp = true;
      }

      if (
        secretary &&
        secretary.profile.user_local_uid !==
          settings.cong_settings.responsabilities.secretary
      ) {
        updateResp = true;
      }

      if (
        service &&
        service.profile.user_local_uid !==
          settings.cong_settings.responsabilities.service
      ) {
        updateResp = true;
      }

      if (updateResp) {
        const responsabilities = structuredClone(
          settings.cong_settings.responsabilities
        );

        responsabilities.coordinator =
          coordinator?.profile.user_local_uid || '';
        responsabilities.secretary = secretary?.profile.user_local_uid || '';
        responsabilities.service = service?.profile.user_local_uid || '';
        responsabilities.updatedAt = new Date().toISOString();

        await dbAppSettingsUpdate({
          'cong_settings.responsabilities': responsabilities,
        });
      }

      await displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

      setIsProcessing(false);

      refetchUser();
    } catch (error) {
      setIsProcessing(false);

      throw new Error((error as Error).message);
    }
  };

  const handleTerminateSession = async (identifier: string) => {
    try {
      const result = await apiAdminRevokeUserSession(user.id, identifier);

      if (result.status !== 200) {
        throw new Error(result.data.message);
      }

      await queryClient.invalidateQueries({
        queryKey: ['congregation_users'],
      });
      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

      refetchUser();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    handleSaveDetails,
    user,
    handleTerminateSession,
    refetchUser,
    isProcessing,
  };
};

export default useUserDetails;
