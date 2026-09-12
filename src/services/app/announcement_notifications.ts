import { InfoBoardAnnouncementType } from '@definition/information_board';
import { NotificationDbRecordType } from '@definition/notification';
import appDb from '@db/appDb';
import { dbNotificationsSave } from '@services/dexie/notifications';
import { getTranslation } from '@services/i18n/translation';

const stringToNumericHash = (value: string): number => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

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

  const id = stringToNumericHash(
    `announcement-${announcement.notification_id}`
  );

  const existing = await appDb.notification.get(id);

  if (existing) return;

  const notification: NotificationDbRecordType = {
    id,
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
