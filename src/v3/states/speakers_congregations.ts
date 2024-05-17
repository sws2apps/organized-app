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
    const congId = congregations.find((record) => record.cong_data.cong_number.value === congNumber)?.id;

    const incomingCongregations = congregations.filter((record) => record.id !== congId);

    return incomingCongregations.sort((a, b) => (a.cong_data.cong_name.value > b.cong_data.cong_name.value ? 1 : -1));
  },
});

export const isAddingCongregationState = atom({
  key: 'isAddingCongregation',
  default: false,
});
