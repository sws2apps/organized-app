import { useAtomValue } from 'jotai';
import {
  apiApproveRequestCongregationSpeakers,
  apiRejectRequestCongregationSpeakers,
} from '@services/api/visitingSpeakers';
import { decryptData } from '@services/encryption';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { encryptedMasterKeyState, speakersKeyState } from '@states/app';
import { congMasterKeyState } from '@states/settings';
import usePendingRequests from '../container/usePendingRequests';
import worker from '@services/worker/backupWorker';

const useSpeakerAccessRequest = (request_id: string) => {
  const { updatePendingRequestsNotification } = usePendingRequests();

  const speakersKey = useAtomValue(speakersKeyState);
  const encryptedMasterKey = useAtomValue(encryptedMasterKeyState);
  const masterKey = useAtomValue(congMasterKeyState);

  const handleAcceptRequest = async () => {
    try {
      const congMasterKey = decryptData(
        encryptedMasterKey,
        masterKey,
        'master_key'
      );

      const decryptedSpeakersKey = decryptData(
        speakersKey,
        congMasterKey,
        'speakers_key'
      );

      const { result, status } = await apiApproveRequestCongregationSpeakers(
        request_id,
        decryptedSpeakersKey
      );

      worker.postMessage('startWorker');

      if (status !== 200) {
        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updatePendingRequestsNotification(result.congregations);
    } catch (err) {
      console.error(err);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
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
        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(result.message),
          severity: 'error',
        });

        return;
      }

      await updatePendingRequestsNotification(result.congregations);
    } catch (err) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  };

  return { handleAcceptRequest, handleRejectRequest };
};

export default useSpeakerAccessRequest;
