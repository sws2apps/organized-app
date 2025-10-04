/*
This file holds the source of the truth from the table "speakers_congregations".
*/

import { atom } from 'jotai';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { congNameState } from './settings';

export const speakersCongregationsState = atom<SpeakersCongregationsType[]>([]);

export const speakersCongregationsActiveState = atom((get) => {
  const congregations = get(speakersCongregationsState);

  return congregations.filter((record) => record._deleted.value === false);
});

export const incomingCongSpeakersState = atom((get) => {
  const congregations = get(speakersCongregationsActiveState);
  const congName = get(congNameState);
  const congId = congregations.find(
    (record) => record.cong_data.cong_name.value === congName
  )?.id;

  const incomingCongregations = congregations.filter(
    (record) => record.id !== congId
  );

  return incomingCongregations.sort((a, b) =>
    a.cong_data.cong_name.value.localeCompare(b.cong_data.cong_name.value)
  );
});

export const isAddingCongregationState = atom(false);

export const congregationsPendingState = atom((get) => {
  const congregations = get(speakersCongregationsActiveState);

  return congregations.filter(
    (record) => record.cong_data.request_status === 'pending'
  );
});

export const congregationsRemoteListState = atom((get) => {
  const congregations = get(speakersCongregationsActiveState);

  return congregations.filter((record) => record.cong_data.cong_id.length > 0);
});

export const congregationsNotDisapprovedState = atom((get) => {
  const congregations = get(speakersCongregationsActiveState);

  return congregations.filter(
    (record) => record.cong_data.request_status !== 'disapproved'
  );
});
