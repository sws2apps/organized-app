/*
This file holds the source of the truth from the table "public_talks".
*/

import { atom, selector } from 'recoil';
import { JWLangState } from './app';
import { TalkLocaleType, TalkType } from '@definition/sources';

export const publicTalksState = atom({
  key: 'publicTalks',
  default: [] as TalkType[],
});

export const publicTalksLocaleState = selector({
  key: 'publicTalksLocale',
  get: async ({ get }) => {
    const talks: TalkType[] = get(publicTalksState);
    const lang = get(JWLangState).toUpperCase();

    const result: TalkLocaleType[] = [];

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
