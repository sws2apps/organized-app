/*
This file holds the source of the truth from the table "public_talks".
*/

import { atom, selector } from 'recoil';
import { appLangState } from './app';

export const publicTalksState = atom({
  key: 'publicTalks',
  default: [],
});

export const publicTalksLocaleState = selector({
  key: 'publicTalksLocale',
  get: async ({ get }) => {
    const talks = get(publicTalksState);
    let lang = get(appLangState);
    lang = lang.toUpperCase();

    const result = [];
    for (const talk of talks) {
      result.push({
        talk_number: talk.talk_number,
        talk_title: talk.talk_title[lang]?.title || '',
        talk_modified: talk.talk_title[lang]?.modified || '',
      });
    }

    return result;
  },
});
