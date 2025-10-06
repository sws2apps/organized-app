import { useCallback, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  congAccountConnectedState,
  encryptedAccessCodeState,
  encryptedMasterKeyState,
  featureFlagsState,
  isAppDataSyncingState,
  speakersKeyState,
  userIDState,
} from '@states/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { StandardNotificationType } from '@definition/notification';
import { notificationsState } from '@states/notification';
import {
  congregationsNotDisapprovedState,
  congregationsPendingState,
  congregationsRemoteListState,
} from '@states/speakers_congregations';
import {
  dbVisitingSpeakersClearRemote,
  dbVisitingSpeakersUpdateRemote,
  decryptVisitingSpeakers,
} from '@services/dexie/visiting_speakers';
import { accountTypeState } from '@states/settings';
import { decryptData, decryptObject } from '@services/encryption';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbSpeakersCongregationsUpdate } from '@services/dexie/speakers_congregations';
import { applicationsState } from '@states/persons';
import { handleDeleteDatabase } from '@services/app';
import { dbHandleIncomingReports } from '@services/dexie/cong_field_service_reports';
import { apiUserGetUpdates } from '@services/api/user';
import { apiFetchNotifications } from '@services/api/notification';
import useJoinRequests from './useJoinRequests';
import usePendingRequests from './usePendingRequests';
import useRemoteNotifications from './useRemoteNotifications';
import useUnverifiedReports from './useUnverifiedReports';
import appDb from '@db/appDb';

const useContainer = () => {
  const { t } = useAppTranslation();

  const { isElder } = useCurrentUser();

  const { updatePendingRequestsNotification } = usePendingRequests();

  const { checkUnverifiedReports } = useUnverifiedReports();

  const { handleRemoteNotifications } = useRemoteNotifications();

  const { setJoinRequests } = useJoinRequests();

  const [notifications, setNotifications] = useAtom(notificationsState);

  const setSpeakersKey = useSetAtom(speakersKeyState);
  const setEncryptedMasterKey = useSetAtom(encryptedMasterKeyState);
  const setEncryptedAccessCode = useSetAtom(encryptedAccessCodeState);
  const setApplications = useSetAtom(applicationsState);

  const congAccountConnected = useAtomValue(congAccountConnectedState);
  const pendingRequests = useAtomValue(congregationsPendingState);
  const congregationRemotes = useAtomValue(congregationsRemoteListState);
  const congregationsNotDisapproved = useAtomValue(
    congregationsNotDisapprovedState
  );

  const accountType = useAtomValue(accountTypeState);
  const userID = useAtomValue(userIDState);
  const FEATURE_FLAGS = useAtomValue(featureFlagsState);
  const isAppSyncing = useAtomValue(isAppDataSyncingState);

  const { data, isFetching } = useQuery({
    enabled:
      userID?.length > 0 &&
      accountType === 'vip' &&
      !isAppSyncing &&
      isElder &&
      congAccountConnected,
    queryKey: ['congregation_updates'],
    queryFn: apiUserGetUpdates,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: 'always',
  });

  const { data: appNotifications } = useQuery({
    queryKey: ['app_notifications'],
    queryFn: apiFetchNotifications,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: 'always',
  });

  const indices = Array.from({ length: notifications.length }, (_, i) => i);

  indices.sort((a, b) =>
    notifications[a].date.localeCompare(notifications[b].date)
  );

  const sortedNotifications = indices.map((i) => notifications[i]);

  const handleUpdateKeys = useCallback(() => {
    if (data?.result?.cong_master_key) {
      setEncryptedMasterKey(data.result.cong_master_key);
    }

    if (data?.result?.cong_access_code) {
      setEncryptedAccessCode(data.result.cong_access_code);
    }

    if (data?.result?.speakers_key) {
      setSpeakersKey(data.result.speakers_key);
    }
  }, [data, setEncryptedMasterKey, setEncryptedAccessCode, setSpeakersKey]);

  const handlePendingSpeakersRequests = useCallback(async () => {
    try {
      if (data?.result?.pending_speakers_requests) {
        updatePendingRequestsNotification(
          data.result.pending_speakers_requests
        );
      }
    } catch (err) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, updatePendingRequestsNotification]);

  const handleRemoteCongregations = useCallback(async () => {
    try {
      if (data?.result?.remote_congregations) {
        for (const pending of pendingRequests) {
          const findApproved = data.result.remote_congregations.find(
            (record) =>
              record.cong_id === pending.cong_data.cong_id &&
              record.request_id === pending.cong_data.request_id
          );

          if (findApproved) {
            const requestNotification: StandardNotificationType = {
              id: `request-cong-approved-${findApproved.cong_id}`,
              title: t('tr_yourRequestAccepted'),
              description: t('tr_yourRequestAcceptedDesc', {
                congregationNameAndNumber: `${findApproved.cong_name} (${findApproved.country_code})`,
              }),
              date: findApproved.updatedAt,
              icon: 'talk',
              enableRead: true,
              read: false,
            };

            setNotifications((prev) => {
              const newValue = prev.filter(
                (record) => record.id !== requestNotification.id
              );
              newValue.push(requestNotification);
              return newValue;
            });
          }
        }

        for await (const cong of data.result.remote_congregations) {
          const foundCong = congregationRemotes.find(
            (record) =>
              record.cong_data.cong_id === cong.cong_id &&
              record.cong_data.request_id === cong.request_id
          );

          if (foundCong) {
            const settings = await appDb.app_settings.get(1);
            const congMasterKey = settings.cong_settings.cong_master_key;

            const masterKey = decryptData(
              data.result.cong_master_key,
              congMasterKey,
              'master_key'
            );

            const speakersKey = decryptData(
              cong.key,
              masterKey,
              'speakers_key'
            );

            const newSpeakers = decryptVisitingSpeakers(cong.list, speakersKey);

            await dbSpeakersCongregationsUpdate(
              { 'cong_data.request_status': 'approved' },
              foundCong.id
            );
            await dbVisitingSpeakersUpdateRemote(newSpeakers, foundCong.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, pendingRequests, setNotifications, t, congregationRemotes]);

  const handleRejectedRequests = useCallback(async () => {
    try {
      if (data?.result?.rejected_requests) {
        if (data.result.rejected_requests.length > 0) {
          for (const congNotDisapproved of congregationsNotDisapproved) {
            const findRejected = data.result.rejected_requests.find(
              (record) =>
                record.cong_id === congNotDisapproved.cong_data.cong_id &&
                record.request_id === congNotDisapproved.cong_data.request_id
            );

            if (findRejected) {
              const requestNotification: StandardNotificationType = {
                id: `request-cong-rejected-${findRejected.cong_id}`,
                title: t('tr_congregationRequestRejected'),
                description: t('tr_congregationRequestRejectedDesc', {
                  congregationNameAndNumber: `${findRejected.cong_name} (${findRejected.country_code})`,
                }),
                date: findRejected.updatedAt,
                icon: 'talk',
                enableRead: true,
                read: false,
              };

              setNotifications((prev) => {
                const newValue = prev.filter(
                  (record) => record.id !== requestNotification.id
                );
                newValue.push(requestNotification);
                return newValue;
              });
            }
          }
        }

        if (data.result.rejected_requests.length === 0) {
          setNotifications((prev) => {
            const newValue = prev.filter(
              (record) =>
                record.id.startsWith('request-cong-rejected-') === false
            );
            return newValue;
          });
        }

        for (const cong of data.result.rejected_requests) {
          const foundCong = congregationRemotes.find(
            (record) =>
              record.cong_data.cong_id === cong.cong_id &&
              record.cong_data.request_id === cong.request_id
          );

          if (foundCong) {
            await dbSpeakersCongregationsUpdate(
              { 'cong_data.request_status': 'disapproved' },
              foundCong.id
            );
            await dbVisitingSpeakersClearRemote(foundCong.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [
    data,
    setNotifications,
    t,
    congregationRemotes,
    congregationsNotDisapproved,
  ]);

  const handleDeletedAccess = useCallback(() => {
    try {
      // only run this after 5 seconds to allow the app to finish processing prev requests
      setTimeout(async () => {
        if (
          data?.result?.rejected_requests &&
          data?.result?.remote_congregations
        ) {
          const incoming = data.result.rejected_requests.concat(
            data.result.remote_congregations
          );

          const deleted = congregationRemotes.filter(
            (record) =>
              !record._deleted.value &&
              record.cong_data.request_status !== 'pending' &&
              !incoming.some((c) => c.cong_id === record.cong_data.cong_id)
          );

          for (const cong of deleted) {
            await dbVisitingSpeakersClearRemote(cong.cong_data.cong_id);

            await dbSpeakersCongregationsUpdate(
              {
                _deleted: { value: true, updatedAt: new Date().toISOString() },
              },
              cong.id
            );
          }
        }
      }, 5000);
    } catch (err) {
      console.error(err);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [congregationRemotes, data]);

  const handleApplications = useCallback(async () => {
    try {
      const incoming = data?.result?.applications;

      if (!incoming) return;

      const settings = await appDb.app_settings.get(1);
      const congAccessCode = settings.cong_settings.cong_access_code;

      const remoteAccessCode = data.result.cong_access_code;
      const accessCode = decryptData(
        remoteAccessCode,
        congAccessCode,
        'access_code'
      );

      const applications = incoming.map((record) => {
        const application = structuredClone(record);
        decryptObject({ data: application, table: 'applications', accessCode });
        return application;
      });

      setApplications(applications);
    } catch (err) {
      console.error(err);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data, setApplications]);

  const handleUnauthorized = useCallback(async () => {
    const status = data?.status;

    if (status === 403) {
      await handleDeleteDatabase();
    }
  }, [data]);

  const handleIncomingReports = useCallback(async () => {
    try {
      const incoming = data?.result?.incoming_reports;

      if (!incoming) return;

      const settings = await appDb.app_settings.get(1);
      const congAccessCode = settings.cong_settings.cong_access_code;

      const remoteAccessCode = data.result.cong_access_code;

      const accessCode = decryptData(
        remoteAccessCode,
        congAccessCode,
        'access_code'
      );

      const reports = incoming.map((record) => {
        const report = structuredClone(record);
        decryptObject({ data: report, table: 'incoming_reports', accessCode });
        return report;
      });

      dbHandleIncomingReports(reports);
    } catch (err) {
      console.error(err);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  }, [data]);

  useEffect(() => {
    if (!isFetching) {
      handleUpdateKeys();

      handleUnauthorized();

      handlePendingSpeakersRequests();

      handleRemoteCongregations();

      handleRejectedRequests();

      handleDeletedAccess();

      handleApplications();

      handleIncomingReports();

      checkUnverifiedReports();
    }
  }, [
    data,
    isFetching,
    handleUpdateKeys,
    handleUnauthorized,
    handlePendingSpeakersRequests,
    handleRemoteCongregations,
    handleRejectedRequests,
    handleApplications,
    handleIncomingReports,
    checkUnverifiedReports,
    handleDeletedAccess,
  ]);

  useEffect(() => {
    if (
      data?.result?.join_requests &&
      Array.isArray(data.result.join_requests)
    ) {
      setJoinRequests(data.result.join_requests);
    }
  }, [FEATURE_FLAGS, data, setJoinRequests]);

  useEffect(() => {
    if (appNotifications && Array.isArray(appNotifications)) {
      handleRemoteNotifications(appNotifications);
    }
  }, [appNotifications, handleRemoteNotifications]);

  useEffect(() => {
    if (navigator.setAppBadge) {
      navigator.setAppBadge(notifications.length);
    }
  }, [notifications]);

  return { notifications: sortedNotifications };
};

export default useContainer;
