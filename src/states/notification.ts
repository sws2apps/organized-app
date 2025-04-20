import { atom } from 'jotai';
import {
  NotificationDbRecordType,
  NotificationRecordType,
} from '@definition/notification';

export const notificationsDbState = atom<NotificationDbRecordType[]>([]);

export const notificationsState = atom<NotificationRecordType[]>([]);

export const countNotificationsState = atom((get) => {
  const notifications = get(notificationsState);
  return notifications.length;
});
