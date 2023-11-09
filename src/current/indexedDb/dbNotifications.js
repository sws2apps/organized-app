import { promiseSetRecoil } from 'recoil-outside';
import { appNotificationsState } from '../states/main';
import appDb from './mainDb';

export const dbGetNotifications = async () => {
  const notifications = await appDb.announcements.toArray();

  return notifications;
};

export const dbSaveNotifications = async (data) => {
  let notifications = await dbGetNotifications();

  await appDb.announcements.clear();

  for await (const announcement of data) {
    const obj = {};
    obj.announcement_id = announcement.id;
    obj.title = [];
    obj.body = [];

    const oldAnnouncement = notifications.find((item) => item.announcement_id === announcement.id);

    // loop through title and body
    announcement.title.forEach((languageItem) => {
      const titleItem = { ...languageItem };
      titleItem.isNew = false;
      titleItem.isRead = false;

      if (oldAnnouncement) {
        const oldTitle = oldAnnouncement.title.find((item) => item.language === languageItem.language);
        if (!oldTitle) {
          titleItem.isNew = true;
        }

        if (oldTitle) {
          titleItem.isRead = oldTitle.isRead || false;
          const dateOldISO = oldTitle.modifiedAt ? new Date(oldTitle.modifiedAt).toISOString() : undefined;
          if (dateOldISO && dateOldISO < languageItem.modifiedAt) {
            titleItem.isNew = true;
            titleItem.isRead = false;
          }
        }
      }

      if (!oldAnnouncement) titleItem.isNew = true;

      obj.title.push(titleItem);
    });

    announcement.body.forEach((languageItem) => {
      const bodyItem = { ...languageItem };
      bodyItem.isNew = false;
      bodyItem.isRead = false;

      if (oldAnnouncement) {
        const oldBody = oldAnnouncement.body.find((item) => item.language === languageItem.language);
        if (!oldBody) {
          bodyItem.isNew = true;
        }

        if (oldBody) {
          bodyItem.isRead = oldBody.isRead || false;
          const dateOldISO = oldBody.modifiedAt ? new Date(oldBody.modifiedAt).toISOString() : undefined;
          if (dateOldISO && dateOldISO < languageItem.modifiedAt) {
            bodyItem.isNew = true;
            bodyItem.isRead = false;
          }
        }
      }

      if (!oldAnnouncement) bodyItem.isNew = true;

      obj.body.push(bodyItem);
    });

    await appDb.announcements.put(obj, announcement.id);
  }

  notifications = await dbGetNotifications();

  await promiseSetRecoil(appNotificationsState, notifications);
};

export const dbReadNotification = async (id, lang) => {
  let announcements = await dbGetNotifications();

  const announcement = announcements.find((item) => item.announcement_id === id);

  if (announcement) {
    const newData = { ...announcement };

    const findTitleIndex = newData.title.findIndex((title) => title.language === lang);
    newData.title[findTitleIndex].isRead = true;

    const findBodyIndex = newData.body.findIndex((body) => body.language === lang);
    newData.body[findBodyIndex].isRead = true;

    await appDb.announcements.put(announcement, id);
  }

  announcements = await dbGetNotifications();
  await promiseSetRecoil(appNotificationsState, announcements);
};
