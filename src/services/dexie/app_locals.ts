import { PARTNER_NOTIFICATION_LOCAL_ID } from '@constants/index';
import appDb from '@db/appDb';

export const dbAppLocalsSaveAvatar = async (buffer: ArrayBuffer) => {
  await appDb.app_locals.put({ id: 1, avatar: buffer });
};

export const dbAppLocalsClearAvatar = async () => {
  const record = await appDb.app_locals.get(1);

  if (!record) return;

  await appDb.app_locals.delete(1);
};
export const dbAppLocalsReadPartnerNotification = (id: string) =>
  appDb.transaction('rw', appDb.app_locals, async () => {
    const record = await appDb.app_locals.get(PARTNER_NOTIFICATION_LOCAL_ID);
    const read = record?.partnerNotificationsRead ?? [];
    if (!read.includes(id))
      await appDb.app_locals.put({
        id: PARTNER_NOTIFICATION_LOCAL_ID,
        partnerNotificationsRead: [...read, id],
      });
  });
