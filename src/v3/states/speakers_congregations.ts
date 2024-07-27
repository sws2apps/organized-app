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

export const speakersCongregationsActiveState = selector({
  key: 'speakersCongregationsActive',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsState);

    return congregations.filter((record) => record._deleted.value === false);
  },
});

export const incomingCongSpeakersState = selector({
  key: 'incomingCongSpeakers',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsActiveState);
    const congNumber = get(congNumberState);
    const congId = congregations.find(
      (record) => record.cong_data.cong_number.value === congNumber
    )?.id;

    const incomingCongregations = congregations.filter(
      (record) => record.id !== congId
    );

    return incomingCongregations.sort((a, b) =>
      a.cong_data.cong_name.value.localeCompare(b.cong_data.cong_name.value)
    );
  },
});

export const isAddingCongregationState = atom({
  key: 'isAddingCongregation',
  default: false,
});

export const congregationsPendingState = selector({
  key: 'congregationsPending',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsActiveState);

    return congregations.filter(
      (record) => record.cong_data.request_status === 'pending'
    );
  },
});

export const congregationsRemoteListState = selector({
  key: 'congregationsRemoteList',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsActiveState);

    return congregations.filter(
      (record) => record.cong_data.cong_id.length > 0
    );
  },
});

export const congregationsNotDisapprovedState = selector({
  key: 'congregationsNotDisapproved',
  get: ({ get }) => {
    const congregations = get(speakersCongregationsActiveState);

    return congregations.filter(
      (record) => record.cong_data.request_status !== 'disapproved'
    );
  },
});
