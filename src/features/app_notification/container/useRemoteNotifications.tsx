import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  NotificationDbRecordType,
  StandardNotificationType,
} from '@definition/notification';
import { notificationsDbState, notificationsState } from '@states/notification';
import {
  dbNotificationsBulkDelete,
  dbNotificationsBulkPut,
} from '@services/dexie/notifications';
import { updateObject } from '@utils/common';

const useRemoteNotifications = () => {
  const setNotifications = useSetAtom(notificationsState);
  const dbNotifications = useAtomValue(notificationsDbState);

  const handleRemoteNotifications = async (
    notifications: NotificationDbRecordType[]
  ) => {
    const remoteLocalNotifications = dbNotifications.filter(
      (record) => record.type !== 'announcement'
    );

    const notificationsToDelete = remoteLocalNotifications.filter(
      (record) => !notifications.some((remote) => remote.id === record.id)
    );

    const idsDelete = notificationsToDelete.map((record) => record.id);

    if (idsDelete.length > 0) {
      await dbNotificationsBulkDelete(idsDelete);
    }

    const notificationsToUpdate: NotificationDbRecordType[] = [];

    for (const remote of notifications) {
      const local = dbNotifications.find((record) => record.id === remote.id);

      if (!local) {
        notificationsToUpdate.push({
          ...remote,
          type: 'remote',
          read: false,
        });

        continue;
      }

      if (local.updatedAt < remote.updatedAt) {
        const newLocal = structuredClone(local);

        updateObject(newLocal, {
          ...remote,
          type: 'remote',
          read: false,
        });

        notificationsToUpdate.push(newLocal);
      }
    }

    if (notificationsToUpdate.length > 0) {
      await dbNotificationsBulkPut(notificationsToUpdate);
    }
  };

  useEffect(() => {
    const unreadNotifications = dbNotifications.filter(
      (record) => !record.read
    );

    setNotifications((prev) => {
      const next = prev.filter((notification) => {
        if (!notification.id.startsWith('standard-notification-')) {
          return true;
        }

        return unreadNotifications.some(
          (record) => notification.id === `standard-notification-${record.id}`
        );
      });

      const existingIds = new Set(next.map((notification) => notification.id));

      for (const notification of unreadNotifications) {
        const id = `standard-notification-${notification.id}`;

        if (existingIds.has(id)) continue;

        const standardNotification: StandardNotificationType = {
          id,
          title: notification.title,
          description: notification.desc,
          date: notification.updatedAt,
          icon: 'standard',
          enableRead: true,
          read: false,
        };

        next.push(standardNotification);
      }

      return next;
    });
  }, [dbNotifications, setNotifications]);

  return { handleRemoteNotifications };
};

export default useRemoteNotifications;
