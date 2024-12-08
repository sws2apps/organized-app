import { CongregationUserType } from '@definition/api';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import { congregationsPersonsState } from '@states/app';
import { personCurrentDetailsState } from '@states/persons';
import { shortDateFormatState } from '@states/settings';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const usePersonAppPersonProfile = () => {
  const { t } = useAppTranslation();
  const congregationsPersons = useRecoilValue(congregationsPersonsState);
  const currentPersonDetails = useRecoilValue(personCurrentDetailsState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const navigate = useNavigate();

  console.log(congregationsPersons);

  const userIsRegistered: boolean = congregationsPersons.some(
    (person) =>
      person.profile.user_local_uid === currentPersonDetails.person_uid
  );

  const currentPersonInCongragation: CongregationUserType =
    congregationsPersons.find(
      (person) =>
        person.profile.user_local_uid === currentPersonDetails.person_uid
    );

  const getTextForAppPersonProfileDesc = () => {
    if (userIsRegistered) {
      const lastTimeOnline =
        currentPersonInCongragation.sessions[0]?.last_seen || null;

      const formatedlastTimeOnline =
        lastTimeOnline && formatDate(new Date(lastTimeOnline), shortDateFormat);

      return t('tr_appUserProfileRegisteredDesc', {
        lastTimeOnline: formatedlastTimeOnline || t('tr_notYet'),
      });
    }

    return t('tr_appUserProfileNotRegisteredDesc');
  };

  const navigateToManageAccess = () => {
    if (userIsRegistered) {
      navigate(`/manage-access/${currentPersonInCongragation.id}`);
      return;
    }

    navigate(`/manage-access/`);
    return;
  };

  return {
    userIsRegistered,
    currentPersonInCongragation,
    getTextForAppPersonProfileDesc,
    navigateToManageAccess,
  };
};

export default usePersonAppPersonProfile;
