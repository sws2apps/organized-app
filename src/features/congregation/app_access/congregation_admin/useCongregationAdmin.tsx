import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import { AppRoleType } from '@definition/app';
import { congregationsAppAdminState } from '@states/app';

const useCongregationAdmin = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const users = useRecoilValue(congregationsAppAdminState);

  const getUserMainRole = useCallback(
    (roles: AppRoleType[]) => {
      if (roles.includes('coordinator')) {
        return t('tr_coordinator');
      }

      if (roles.includes('secretary')) {
        return t('tr_secretary');
      }

      if (roles.includes('service_overseer')) {
        return t('tr_serviceOverseer');
      }

      if (roles.includes('midweek_schedule')) {
        return t('tr_midweekMeetingOverseer');
      }

      if (roles.includes('public_talk_schedule')) {
        return t('tr_publicTalkCoordinator');
      }
    },
    [t]
  );

  const usersList = useMemo(() => {
    return users.map((user) => {
      return {
        person_id: user.id,
        person_name: buildPersonFullname(
          user.profile.lastname.value,
          user.profile.firstname.value,
          fullnameOption
        ),
        person_role: getUserMainRole(user.profile?.cong_role || []),
      };
    });
  }, [users, fullnameOption, getUserMainRole]);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { handleOpenUserDetails, usersList };
};

export default useCongregationAdmin;
