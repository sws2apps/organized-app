import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { IconTalk } from '@components/icons';
import { congAccountConnectedState, encryptedMasterKeyState, speakersKeyState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { CongregationSpeakerRequestType, NotificationRecordType } from '@definition/notification';
import { notificationsState } from '@states/notification';
import { apiGetCongregationUpdates } from '@services/api/congregation';
import { congregationsPendingState, congregationsRemoteListState } from '@states/speakers_congregations';
import {
  dbVisitingSpeakersClearRemote,
  dbVisitingSpeakersUpdateRemote,
  decryptVisitingSpeakers,
} from '@services/dexie/visiting_speakers';
import { congMasterKeyState } from '@states/settings';
import { decryptData } from '@services/encryption';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbSpeakersCongregationsUpdate } from '@services/dexie/speakers_congregations';

const useContainer = () => {
  const { t } = useAppTranslation();

  const [notifications, setNotifications] = useRecoilState(notificationsState);

  const setSpeakersKey = useSetRecoilState(speakersKeyState);
  const setEncryptedMasterKey = useSetRecoilState(encryptedMasterKeyState);

  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const pendingRequests = useRecoilValue(congregationsPendingState);
  const congregationRemotes = useRecoilValue(congregationsRemoteListState);
  const congMasterKey = useRecoilValue(congMasterKeyState);

  const { isLoading, data } = useQuery({
    enabled: congAccountConnected,
    queryKey: ['congregation_updates'],
    queryFn: apiGetCongregationUpdates,
    refetchInterval: 30000,
  });

  const handlePendingSpeakersRequests = useCallback(async () => {
    try {
      if (data?.result?.pending_speakers_requests) {
        if (data.result.pending_speakers_requests.length > 0) {
          setSpeakersKey(data.result.speakers_key);
          setEncryptedMasterKey(data.result.cong_master_key);

          const lastUpdated = data.result.pending_speakers_requests.sort((a, b) =>
            a.updatedAt.localeCompare(b.updatedAt)
          )[0].updatedAt;

          const requestNotification: NotificationRecordType = {
            id: 'request-cong',
            type: 'speakers-request',
            title: t('tr_requestSpeakersList'),
            description: t('tr_requestSpeakersListDesc'),
            date: lastUpdated,
            options: [] as CongregationSpeakerRequestType[],
            icon: <IconTalk color="var(--black)" />,
          };

          for (const congRequest of data.result.pending_speakers_requests) {
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

        if (data.result.pending_speakers_requests.length === 0) {
          setNotifications((prev) => {
            const newValue = prev.filter((record) => record.id !== 'request-cong');
            return newValue;
          });
        }
      }
    } catch (err) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, t, setEncryptedMasterKey, setNotifications, setSpeakersKey]);

  const handleRemoteCongregations = useCallback(async () => {
    try {
      if (data?.result?.remote_congregations) {
        for (const pending of pendingRequests) {
          const findApproved = data.result.remote_congregations.find(
            (record) =>
              record.cong_id === pending.cong_data.cong_id && record.request_id === pending.cong_data.request_id
          );

          if (findApproved) {
            const requestNotification: NotificationRecordType = {
              id: `request-cong-approved-${findApproved.cong_id}`,
              type: 'speakers-request',
              title: t('tr_yourRequestAccepted'),
              description: t('tr_yourRequestAcceptedDesc', {
                congregationNameAndNumber: `${findApproved.cong_name} (${findApproved.cong_number})`,
              }),
              date: findApproved.updatedAt,
              icon: <IconTalk color="var(--black)" />,
              enableRead: true,
              read: false,
            };

            setNotifications((prev) => {
              const newValue = prev.filter((record) => record.id !== requestNotification.id);
              newValue.push(requestNotification);
              return newValue;
            });
          }
        }

        for (const cong of data.result.remote_congregations) {
          const foundCong = congregationRemotes.find(
            (record) => record.cong_data.cong_id === cong.cong_id && record.cong_data.request_id === cong.request_id
          );

          if (foundCong) {
            const masterKey = decryptData(data.result.cong_master_key, congMasterKey);
            const speakersKey = decryptData(cong.key, masterKey);

            const newSpeakers = decryptVisitingSpeakers(cong.list, speakersKey);

            await dbSpeakersCongregationsUpdate({ 'cong_data.request_status': 'approved' }, foundCong.id);
            await dbVisitingSpeakersUpdateRemote(newSpeakers, foundCong.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, pendingRequests, setNotifications, t, congregationRemotes, congMasterKey]);

  const handleRejectedRequests = useCallback(async () => {
    try {
      if (data?.result?.rejected_requests) {
        if (data.result.rejected_requests.length > 0) {
          for (const pending of pendingRequests) {
            const findRejected = data.result.rejected_requests.find(
              (record) =>
                record.cong_id === pending.cong_data.cong_id && record.request_id === pending.cong_data.request_id
            );

            if (findRejected) {
              const requestNotification: NotificationRecordType = {
                id: `request-cong-rejected-${findRejected.cong_id}`,
                type: 'speakers-request',
                title: t('tr_congregationRequestRejected'),
                description: t('tr_congregationRequestRejectedDesc', {
                  congregationNameAndNumber: `${findRejected.cong_name} (${findRejected.cong_number})`,
                }),
                date: findRejected.updatedAt,
                icon: <IconTalk color="var(--black)" />,
                enableRead: true,
                read: false,
              };

              setNotifications((prev) => {
                const newValue = prev.filter((record) => record.id !== requestNotification.id);
                newValue.push(requestNotification);
                return newValue;
              });
            }
          }
        }

        if (data.result.rejected_requests.length === 0) {
          setNotifications((prev) => {
            const newValue = prev.filter((record) => record.id.startsWith('request-cong-rejected-') === false);
            return newValue;
          });
        }

        for (const cong of data.result.rejected_requests) {
          const foundCong = congregationRemotes.find(
            (record) => record.cong_data.cong_id === cong.cong_id && record.cong_data.request_id === cong.request_id
          );

          if (foundCong) {
            await dbSpeakersCongregationsUpdate({ 'cong_data.request_status': 'disapproved' }, foundCong.id);
            await dbVisitingSpeakersClearRemote(foundCong.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, pendingRequests, setNotifications, t, congregationRemotes]);

  useEffect(() => {
    if (!isLoading) {
      handlePendingSpeakersRequests();

      handleRemoteCongregations();

      handleRejectedRequests();
    }
  }, [isLoading, handlePendingSpeakersRequests, handleRemoteCongregations, handleRejectedRequests]);

  useEffect(() => {
    if (navigator.setAppBadge) {
      navigator.setAppBadge(notifications.length);
    }
  }, [notifications]);

  return {
    notifications: notifications.sort((a, b) => a.date.localeCompare(b.date)),
  };
};

export default useContainer;
