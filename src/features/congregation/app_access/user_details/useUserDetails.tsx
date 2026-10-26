import { useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import {
  apiAdminRevokeUserSession,
  apiCongregationUserUpdate,
} from '@services/api/congregation';
import { CongregationUserType } from '@definition/api';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import {
  congregationUsersState,
  isProcessingUserState,
} from '@states/congregation';
import { userIDState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import { useMemo } from 'react';
import { getMessageByCode } from '@services/i18n/translation';

const useUserDetails = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const [isProcessing, setIsProcessing] = useAtom(isProcessingUserState);
  const [users, setUsers] = useAtom(congregationUsersState);

  const userID = useAtomValue(userIDState);
  const settings = useAtomValue(settingsState);

  const currentUser = useMemo(() => {
    return users.find((record) => record.id === id);
  }, [users, id]);

  const handleSaveDetails = async (
    user: CongregationUserType,
    code?: string
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const users = await apiCongregationUserUpdate({
        user_id: user.id,
        cong_person_uid: user.profile.user_local_uid || '',
        cong_person_delegates: user.profile.user_members_delegate,
        cong_role: user.profile.cong_role,
        user_secret_code: code,
        first_name: user.profile.firstname.value,
        last_name: user.profile.lastname.value,
      });

      const savedUser = users.find((record) => record.id === user.id);
      if (!savedUser) {
        throw new Error(getMessageByCode('error_app_generic-title'));
      }
      setUsers(users);

      // Apply only the identity and roles accepted by the server.
      if (userID === id) {
        await dbAppSettingsUpdate({
          'user_settings.user_local_uid':
            savedUser.profile.user_local_uid || '',
          'user_settings.user_members_delegate':
            savedUser.profile.user_members_delegate,
          'user_settings.cong_role': savedUser.profile.cong_role,
        });
      }

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

      displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      throw new Error((error as Error).message);
    }
  };

  const handleTerminateSession = async (identifier: string) => {
    try {
      const users = await apiAdminRevokeUserSession(currentUser.id, identifier);
      setUsers(users);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    handleSaveDetails,
    currentUser,
    handleTerminateSession,
    isProcessing,
  };
};

export default useUserDetails;
