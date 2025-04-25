import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { joinRequestsState } from '@states/congregation';
import { notificationsState } from '@states/notification';
import {
  JoinRequestNotificationType,
  NotificationRecordType,
} from '@definition/notification';

const useJoinRequests = () => {
  const { t } = useAppTranslation();

  const [joinRequests, setJoinRequests] = useAtom(joinRequestsState);

  const setNotifications = useSetAtom(notificationsState);

  useEffect(() => {
    if (joinRequests.length > 0) {
      const lastUpdated = joinRequests.sort((a, b) =>
        b.request_date.localeCompare(a.request_date)
      )[0].request_date;

      const joinRequestNotification: JoinRequestNotificationType = {
        id: 'join-requests',
        title: t('tr_joinRequestsTitle'),
        description: t('tr_joinRequestsDesc'),
        date: lastUpdated,
        icon: 'join-requests',
        requests: [],
        enableRead: false,
      };

      joinRequestNotification.requests = [...joinRequests];

      setNotifications((prev) => {
        const newValue: NotificationRecordType[] = prev.filter(
          (record) => record.id !== 'join-requests'
        );

        newValue.push(joinRequestNotification);

        return newValue;
      });
    }

    if (joinRequests.length === 0) {
      setNotifications((prev) => {
        const newValue = prev.filter((record) => record.id !== 'join-requests');

        return newValue;
      });
    }
  }, [joinRequests, setNotifications, t]);

  return { setJoinRequests };
};

export default useJoinRequests;
