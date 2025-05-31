import { atom } from 'jotai';
import { PublicTalkLocaleType, PublicTalkType } from '@definition/public_talks';
import { JWLangState } from './settings';

export const publicTalksState = atom<PublicTalkType[]>([]);

export const publicTalksSearchKeyState = atom('');

export const publicTalksLocaleState = atom((get) => {
  const lang = get(JWLangState);
  const talks = get(publicTalksState);

  return talks.map((talk) => {
    return {
      talk_number: talk.talk_number,
      talk_title: talk.talk_title[lang] ?? '',
    } as PublicTalkLocaleType;
  });
});

export const publicTalksFilteredState = atom((get) => {
  const talks = get(publicTalksLocaleState);
  const search = get(publicTalksSearchKeyState);

  const filteredList = talks.filter((talk) => {
    const value = talk.talk_title;
    return value.toLowerCase().includes(search.toLowerCase());
  });

  return filteredList;
});
