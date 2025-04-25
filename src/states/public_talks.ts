import { atom } from 'jotai';
import { PublicTalkType } from '@definition/public_talks';

export const publicTalksState = atom<PublicTalkType[]>([]);

export const publicTalksSearchKeyState = atom('');

export const publicTalksFilteredState = atom((get) => {
  const talks = get(publicTalksState);
  const search = get(publicTalksSearchKeyState);

  const filteredList = talks.filter(
    (talk) => talk.talk_title.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  return filteredList;
});
