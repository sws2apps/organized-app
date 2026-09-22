/*
This file holds the source of the truth from the table "preaching_partner_requests".
*/

import { atom } from 'jotai';
import {
  PreachingPartnerFilterType,
  PreachingPartnerRequestType,
  PreachingPartnerTab,
} from '@definition/preaching_partner';
import {
  preachingPartnerGroupByDate,
  preachingPartnerMatchesFilters,
  preachingPartnerSort,
} from '@services/app/preaching_partner';
import { personsActiveState } from './persons';
import { userLocalUIDState } from './settings';

export const preachingPartnerRequestsDbState = atom<
  PreachingPartnerRequestType[]
>([]);

export const preachingPartnerTabState = atom<PreachingPartnerTab>('mine');

export const preachingPartnerFiltersState = atom<PreachingPartnerFilterType[]>([
  'all',
]);

export const preachingPartnerRequestsState = atom((get) => {
  const requests = get(preachingPartnerRequestsDbState);

  return preachingPartnerSort(
    requests.filter((record) => !record.request_data._deleted)
  );
});

export const myPreachingPartnerRequestsState = atom((get) => {
  const requests = get(preachingPartnerRequestsState);
  const uid = get(userLocalUIDState);

  return requests.filter((record) => record.request_data.person_uid === uid);
});

export const myPreachingPartnerGroupsState = atom((get) =>
  preachingPartnerGroupByDate(get(myPreachingPartnerRequestsState))
);

// requests from other publishers that nobody has arranged with yet
export const congregationPreachingPartnerRequestsState = atom((get) => {
  const requests = get(preachingPartnerRequestsState);
  const uid = get(userLocalUIDState);

  return requests.filter(
    (record) =>
      record.request_data.person_uid !== uid && !record.request_data.partner_uid
  );
});

export const congregationPreachingPartnerGroupsState = atom((get) => {
  const requests = get(congregationPreachingPartnerRequestsState);
  const filters = get(preachingPartnerFiltersState);
  const persons = get(personsActiveState);

  const filtered = requests.filter((request) =>
    preachingPartnerMatchesFilters(request, filters, persons)
  );

  return preachingPartnerGroupByDate(filtered);
});

// requests of mine somebody has joined, newest first
export const myArrangedPreachingPartnerRequestsState = atom((get) => {
  const requests = get(myPreachingPartnerRequestsState);

  return requests
    .filter((record) => record.request_data.partner_uid)
    .sort((a, b) =>
      (b.request_data.arranged_at ?? '').localeCompare(
        a.request_data.arranged_at ?? ''
      )
    );
});
