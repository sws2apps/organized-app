import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { IconTalk } from '@components/icons';
import { CongregationRequestType } from '@definition/api';
import {
  NotificationRecordType,
  SpeakerNotificationType,
} from '@definition/notification';
import useAppTranslation from '@hooks/useAppTranslation';
import { notificationsState } from '@states/notification';

const usePendingRequests = () => {
  const { t } = useAppTranslation();

  const setNotifications = useSetRecoilState(notificationsState);

  const updatePendingRequestsNotification = useCallback(
    async (requets: CongregationRequestType[]) => {
      if (requets.length > 0) {
        const lastUpdated = requets.sort((a, b) =>
          a.updatedAt.localeCompare(b.updatedAt)
        )[0].updatedAt;

        const requestNotification: SpeakerNotificationType = {
          id: 'speakers-request',
          title: t('tr_requestSpeakersList'),
          description: t('tr_requestSpeakersListDesc'),
          date: lastUpdated,
          icon: <IconTalk color="var(--black)" />,
          congs: [],
          enableRead: false,
        };

        for (const congRequest of requets) {
          requestNotification.congs.push({
            request_id: congRequest.request_id,
            cong_name: congRequest.cong_name,
            cong_number: congRequest.cong_number,
            country_code: congRequest.country_code,
          });
        }

        setNotifications((prev) => {
          const newValue: NotificationRecordType[] = prev.filter(
            (record) => record.id !== 'speakers-request'
          );

          newValue.push(requestNotification);

          return newValue;
        });
      }

      if (requets.length === 0) {
        setNotifications((prev) => {
          const newValue = prev.filter(
            (record) => record.id !== 'speakers-request'
          );

          return newValue;
        });
      }
    },
    [setNotifications, t]
  );

  return { updatePendingRequestsNotification };
};

export default usePendingRequests;
