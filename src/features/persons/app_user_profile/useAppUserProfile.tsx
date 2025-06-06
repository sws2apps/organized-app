import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { congregationUsersState } from '@states/app';
import { personCurrentDetailsState } from '@states/persons';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@utils/date';

const useAppUserProfile = () => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const congregationsUsers = useAtomValue(congregationUsersState);
  const currentPersonDetails = useAtomValue(personCurrentDetailsState);
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const user = useMemo(() => {
    return congregationsUsers.find(
      (person) =>
        person.profile.user_local_uid === currentPersonDetails.person_uid
    );
  }, [congregationsUsers, currentPersonDetails]);

  const last_seen = useMemo(() => {
    if (!user) return;

    if (!user.sessions) return;

    if (user.sessions.length === 0) return;

    const last = user.sessions
      .toSorted((a, b) => b.last_seen.localeCompare(a.last_seen))
      .at(0);

    return last.last_seen;
  }, [user]);

  const userDescription = useMemo(() => {
    if (!user) {
      return t('tr_appUserProfileNotRegisteredDesc');
    }

    const createdFormatted = last_seen
      ? formatDate(new Date(last_seen), shortDateFormat)
      : t('tr_notYet');

    return t('tr_appUserProfileRegisteredDesc', {
      lastTimeOnline: createdFormatted,
    });
  }, [user, t, shortDateFormat, last_seen]);

  const navigateToManageAccess = () => {
    if (user) {
      navigate(`/manage-access/${user.id}`);
      return;
    }

    navigate(`/manage-access`);
  };

  return { user, userDescription, navigateToManageAccess };
};

export default useAppUserProfile;
