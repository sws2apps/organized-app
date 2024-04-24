/*
This file holds the source of the truth from the table "speakers_congregations".
*/

import { atom, selector } from 'recoil';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { congNumberState } from './settings';

export const speakersCongregationsState = atom<SpeakersCongregationsType[]>({
  key: 'speakersCongregations',
  default: [],
});

export const incomingCongSpeakersState = selector({
  key: 'incomingCongSpeakers',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsState);
    const congNumber = get(congNumberState);

    const incomingCongregations = congregations.filter((record) => record.cong_number !== congNumber);

    return incomingCongregations.sort((a, b) => (a.cong_name.value > b.cong_name.value ? 1 : -1));
  },
});
