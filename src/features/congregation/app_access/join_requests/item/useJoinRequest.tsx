import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { JoinRequestProps } from './index.types';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { joinRequestsState } from '@states/congregation';
import {
  apiCongregationJoinRequestAccept,
  apiCongregationJoinRequestDecline,
  apiCongregationUsersGet,
} from '@services/api/congregation';
import { AppRoleType } from '@definition/app';
import { personsState } from '@states/persons';
import { congregationUsersState } from '@states/app';

const useJoinRequest = ({ request }: JoinRequestProps) => {
  const { t } = useAppTranslation();

  const setRequests = useSetRecoilState(joinRequestsState);
  const setUsers = useSetRecoilState(congregationUsersState);

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const persons = useRecoilValue(personsState);

  const [isProcessingDecline, setIsProcessingDecline] = useState(false);
  const [isProcessingAccept, setIsProcessingAccept] = useState(false);

  const fullname = useMemo(() => {
    return buildPersonFullname(
      request.lastname,
      request.firstname,
      fullnameOption
    );
  }, [request, fullnameOption]);

  const handleAcceptRequest = async (
    person_uid: string,
    role: AppRoleType[]
  ) => {
    if (isProcessingDecline || isProcessingAccept) return;

    try {
      setIsProcessingAccept(true);

      const person = persons.find((record) => record.person_uid === person_uid);
      const firstname = person.person_data.person_firstname.value;
      const lastname = person.person_data.person_lastname.value;

      const requests = await apiCongregationJoinRequestAccept({
        user: request.user,
        firstname,
        lastname,
        person_uid,
        role,
      });

      setRequests(requests);

      const users = await apiCongregationUsersGet();
      setUsers(users);

      setIsProcessingAccept(false);
    } catch (error) {
      setIsProcessingAccept(false);

      console.error(error);

      await displaySnackNotification({
        header: t('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDeclineRequest = async () => {
    if (isProcessingDecline || isProcessingAccept) return;

    try {
      setIsProcessingDecline(true);

      const requests = await apiCongregationJoinRequestDecline(request.user);
      setRequests(requests);

      setIsProcessingDecline(false);
    } catch (error) {
      setIsProcessingDecline(false);

      console.error(error);

      await displaySnackNotification({
        header: t('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    fullname,
    isProcessingDecline,
    isProcessingAccept,
    handleDeclineRequest,
    handleAcceptRequest,
  };
};

export default useJoinRequest;
