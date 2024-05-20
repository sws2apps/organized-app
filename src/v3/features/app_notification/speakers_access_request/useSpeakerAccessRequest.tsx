import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IconTalk } from '@components/icons';
import { CongregationSpeakerRequestType, NotificationRecordType } from '@definition/notification';
import { useAppTranslation } from '@hooks/index';
import {
  apiApproveRequestCongregationSpeakers,
  apiRejectRequestCongregationSpeakers,
} from '@services/api/visitingSpeakers';
import { decryptData } from '@services/encryption';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/recoil/app';
import { encryptedMasterKeyState, speakersKeyState } from '@states/app';
import { notificationsState } from '@states/notification';
import { congMasterKeyState } from '@states/settings';
import { VisitingSpeakersAccessResponseType } from '@definition/api';

const useSpeakerAccessRequest = (request_id: string) => {
  const { t } = useAppTranslation();

  const setNotifications = useSetRecoilState(notificationsState);

  const speakersKey = useRecoilValue(speakersKeyState);
  const encryptedMasterKey = useRecoilValue(encryptedMasterKeyState);
  const masterKey = useRecoilValue(congMasterKeyState);

  const updateNotification = async (result: VisitingSpeakersAccessResponseType['result']) => {
    if (result.congregations.length > 0) {
      const lastUpdated = result.congregations.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))[0].updatedAt;

      const requestNotification: NotificationRecordType = {
        id: 'request-cong',
        type: 'speakers-request',
        title: t('tr_requestSpeakersList'),
        description: t('tr_requestSpeakersListDesc'),
        date: lastUpdated,
        options: [] as CongregationSpeakerRequestType[],
        icon: <IconTalk color="var(--black)" />,
      };

      for (const congRequest of result.congregations) {
        requestNotification.options.push({
          request_id: congRequest.request_id,
          cong_name: congRequest.cong_name,
          cong_number: congRequest.cong_number,
          country_code: congRequest.country_code,
        });
      }

      setNotifications((prev) => {
        const newValue = prev.filter((record) => record.id !== 'request-cong');
        newValue.push(requestNotification);
        return newValue;
      });
    }

    if (result.congregations.length === 0) {
      setNotifications((prev) => {
        const newValue = prev.filter((record) => record.id !== 'request-cong');
        return newValue;
      });
    }
  };

  const handleAcceptRequest = async () => {
    try {
      const congMasterKey = decryptData(encryptedMasterKey, masterKey);
      const decryptedSpeakersKey = decryptData(speakersKey, congMasterKey);

      const { result, status } = await apiApproveRequestCongregationSpeakers(request_id, decryptedSpeakersKey);

      if (status !== 200) {
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updateNotification(result);
    } catch (err) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  };

  const handleRejectRequest = async () => {
    try {
      const { result, status } = await apiRejectRequestCongregationSpeakers(request_id);

      if (status !== 200) {
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updateNotification(result);
    } catch (err) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  };

  return { handleAcceptRequest, handleRejectRequest };
};

export default useSpeakerAccessRequest;
