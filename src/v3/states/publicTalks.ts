/*
This file holds the source of the truth from the table "public_talks".
*/

import { atom, selector } from 'recoil';
import { PublicTalkType } from '@definition/public_talks';

export const publicTalksState = atom({
  key: 'publicTalks',
  default: [] as PublicTalkType[],
});

export const publicTalksSearchKeyState = atom({
  key: 'publicTalksSearchKey',
  default: '',
});

export const publicTalksFilteredState = selector({
  key: 'publicTalksFiltered',
  get: async ({ get }) => {
    const talks = get(publicTalksState);
    const search = get(publicTalksSearchKeyState);

    const filteredList = talks.filter((talk) => talk.talk_title.toLowerCase().indexOf(search.toLowerCase()) !== -1);

    return filteredList;
  },
});
