import { NotificationDbRecordType } from '@definition/notification';
import appDb from '@db/appDb';

export const dbNotificationsBulkDelete = async (keys: number[]) => {
  await appDb.notification.bulkDelete(keys);
};

export const dbNotificationsBulkPut = async (
  notifications: NotificationDbRecordType[]
) => {
  await appDb.notification.bulkPut(notifications);
};

export const dbNotificationsSave = async (
  notification: NotificationDbRecordType
) => {
  await appDb.notification.put(notification);
};
