import { Table } from 'dexie';
import { NotificationDbRecordType } from '@definition/notification';

export type NotificationTable = {
  notification: Table<NotificationDbRecordType>;
};

export const notificationSchema = {
  notification: '&id, updatedAt, title, desc, read',
};
