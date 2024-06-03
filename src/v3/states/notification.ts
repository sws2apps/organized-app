import { atom, selector } from 'recoil';
import { NotificationRecordType } from '@definition/notification';

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
