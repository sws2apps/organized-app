import { atom, selector } from 'recoil';
import { PublicTalkType } from '@definition/public_talks';

export const publicTalksState = atom<PublicTalkType[]>({
  key: 'publicTalks',
  default: [],
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
