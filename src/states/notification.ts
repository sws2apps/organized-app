import { atom, selector } from 'recoil';
import {
  NotificationDbRecordType,
  NotificationRecordType,
} from '@definition/notification';

export const notificationsDbState = atom<NotificationDbRecordType[]>({
  key: 'notificationsDb',
  default: [],
});

export const notificationsState = atom<NotificationRecordType[]>({
  key: 'notifications',
  default: [],
});

export const countNotificationsState = selector({
  key: 'countNotifications',
  get: ({ get }) => {
    const notifications = get(notificationsState);
    return notifications.length;
  },
});
