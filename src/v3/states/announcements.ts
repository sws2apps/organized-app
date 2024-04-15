/*
This file holds the source of the truth from the table "announcements".
*/

import { atom, selector } from 'recoil';
import { appLangState } from './app';
import { LANGUAGE_LIST } from '@constants/index';
import { countUnreadNotifications } from '@utils/common';

export const announcementsState = atom({
  key: 'announcements',
  default: [],
});

export const countAnnouncementsState = selector({
  key: 'countAnnouncements',
  get: ({ get }) => {
    const announcements = get(announcementsState);
    const appLang = get(appLangState);

    const fldKey = LANGUAGE_LIST.find((language) => language.code === appLang).locale;
    const count = countUnreadNotifications({ announcements, language: fldKey });
    return count;
  },
});
