/*
This file holds the source of the truth from the table "visiting_speakers".
*/

import { atom, selector } from 'recoil';
import { congNumberState } from './settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export const visitingSpeakersState = atom<VisitingSpeakerType[]>({
  key: 'visitingSpeakers',
  default: [],
});

export const outgoingSpeakersState = selector({
  key: 'outgoingSpeakers',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersState);
    const congNumber = get(congNumberState);

    const outgoingSpeakers =
      speakers.filter((record) => record.cong_number === congNumber && record._deleted === null) || [];

    return outgoingSpeakers;
  },
});
