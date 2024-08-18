import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { refreshScreenState } from '@states/app';
import { apiCongregationUserUpdate } from '@services/api/congregation';
import { CongregationUserType } from '@definition/api';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';

const useUserDetails = () => {
  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const forceRefresh = useSetRecoilState(refreshScreenState);

  const handleSaveDetails = async (
    user: CongregationUserType,
    code?: string
  ) => {
    try {
      const { status, message } = await apiCongregationUserUpdate({
        user_id: user.id,
        cong_person_uid: user.user_local_uid,
        cong_person_delegates: user.user_delegates,
        cong_role: user.cong_role,
        user_secret_code: code,
      });

      if (status !== 200) {
        throw new Error(message);
      }

      await queryClient.invalidateQueries({ queryKey: ['congregation_users'] });
      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

      await displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

      forceRefresh((prev) => !prev);
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  return { handleSaveDetails };
};

export default useUserDetails;
