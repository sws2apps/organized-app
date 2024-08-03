/*
This file holds the source of the truth from the table "visiting_speakers".
*/

import { atom, selector } from 'recoil';
import { congNumberState } from './settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { speakersCongregationsState } from './speakers_congregations';

export const visitingSpeakersState = atom<VisitingSpeakerType[]>({
  key: 'visitingSpeakers',
  default: [],
});

export const outgoingSpeakersState = selector({
  key: 'outgoingSpeakers',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersState);
    const congregations = get(speakersCongregationsState);
    const congNumber = get(congNumberState);

    const congId = congregations.find(
      (record) => record.cong_data.cong_number.value === congNumber
    )?.id;

    const outgoingSpeakers =
      speakers.filter(
        (record) =>
          record.speaker_data.cong_id === congId &&
          record._deleted.value === false
      ) || [];

    return outgoingSpeakers;
  },
});

export const incomingSpeakersState = selector({
  key: 'incomingSpeakers',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersState);
    const congregations = get(speakersCongregationsState);
    const congNumber = get(congNumberState);

    const congId = congregations.find(
      (record) => record.cong_data.cong_number.value === congNumber
    )?.id;

    const incomingSpeakers =
      speakers.filter(
        (record) =>
          record.speaker_data.cong_id !== congId &&
          record._deleted.value === false
      ) || [];

    return incomingSpeakers;
  },
});
