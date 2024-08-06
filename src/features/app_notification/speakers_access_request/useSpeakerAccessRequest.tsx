import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  apiApproveRequestCongregationSpeakers,
  apiRejectRequestCongregationSpeakers,
} from '@services/api/visitingSpeakers';
import { decryptData } from '@services/encryption';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/recoil/app';
import { encryptedMasterKeyState, speakersKeyState } from '@states/app';
import { congMasterKeyState } from '@states/settings';
import usePendingRequests from '../container/usePendingRequests';

const useSpeakerAccessRequest = (request_id: string) => {
  const { t } = useAppTranslation();

  const { updatePendingRequestsNotification } = usePendingRequests();

  const speakersKey = useRecoilValue(speakersKeyState);
  const encryptedMasterKey = useRecoilValue(encryptedMasterKeyState);
  const masterKey = useRecoilValue(congMasterKeyState);

  const handleAcceptRequest = async () => {
    try {
      const congMasterKey = decryptData(encryptedMasterKey, masterKey);
      const decryptedSpeakersKey = decryptData(speakersKey, congMasterKey);

      const { result, status } = await apiApproveRequestCongregationSpeakers(
        request_id,
        decryptedSpeakersKey
      );

      if (status !== 200) {
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updatePendingRequestsNotification(result.congregations);
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
      const { result, status } =
        await apiRejectRequestCongregationSpeakers(request_id);

      if (status !== 200) {
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updatePendingRequestsNotification(result.congregations);
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
