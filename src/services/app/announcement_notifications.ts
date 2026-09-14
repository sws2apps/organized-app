import { InfoBoardAnnouncementType } from '@definition/information_board';
import { NotificationDbRecordType } from '@definition/notification';
import appDb from '@db/appDb';
import { dbNotificationsSave } from '@services/dexie/notifications';
import { getTranslation } from '@services/i18n/translation';

export const createAnnouncementNotification = async (
  announcement: InfoBoardAnnouncementType
) => {
  if (
    announcement._deleted ||
    !announcement.notify_everybody ||
    !announcement.notification_id
  ) {
    return;
  }

  const existing = await appDb.notification
    .where('notificationId')
    .equals(announcement.notification_id)
    .first();

  if (existing) return;

  const notification: NotificationDbRecordType = {
    id: Date.now(),
    notificationId: announcement.notification_id,
    type: 'announcement',
    updatedAt: announcement.updatedAt,
    title:
      announcement.title.trim() ||
      getTranslation({ key: 'tr_infoBoardAnnouncements' }),
    desc: announcement.short_description?.trim() || announcement.text || '',
    read: false,
  };

  await dbNotificationsSave(notification);
};
