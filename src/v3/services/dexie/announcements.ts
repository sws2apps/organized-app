import { promiseGetRecoil } from 'recoil-outside';
import { announcementsState } from '@states/announcements';
import { appDb } from '.';

export const markNotificationRead = async (id: string, lang: string) => {
  const announcements = await promiseGetRecoil(announcementsState);

  const announcement = announcements.find((item) => item.announcement_id === id);

  if (announcement) {
    const newData = { ...announcement };

    const findTitleIndex = newData.title.findIndex((title) => title.language === lang);
    newData.title[findTitleIndex].isRead = true;

    const findBodyIndex = newData.body.findIndex((body) => body.language === lang);
    newData.body[findBodyIndex].isRead = true;

    await appDb.announcements.put(announcement);
  }
};
