import { PARTNER_NOTIFICATION_LOCAL_ID } from '@constants/index';
import { appLocalsState } from '@states/app_locals';
/*
This file holds the source of the truth from the table "preaching_partner_requests".
*/

import { atom } from 'jotai';
import {
  PartnerMutation,
  PreachingPartnerFilterType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import {
  preachingPartnerMutate,
  preachingPartnerReadNotification,
  preachingPartnerGroupByDate,
  preachingPartnerMatchesFilters,
  preachingPartnerSort,
} from '@services/app/preaching_partner';
import { personsActiveState } from '@states/persons';
import { partnerToday } from '@utils/preaching_partner';
import { userLocalUIDState } from '@states/settings';

export const preachingPartnerRequestsDbState = atom<
  PreachingPartnerRequestType[]
>([]);

export const preachingPartnerFiltersState = atom<PreachingPartnerFilterType[]>([
  'all',
]);

export const partnerTodayState = atom(partnerToday());
partnerTodayState.onMount = (set) => {
  const refresh = () => set(partnerToday());
  refresh();
  const timer = setInterval(refresh, 60_000);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', refresh);
  return () => {
    clearInterval(timer);
    window.removeEventListener('focus', refresh);
    document.removeEventListener('visibilitychange', refresh);
  };
};

export const partnerMutationState = atom(
  null,
  (get, _set, mutation: PartnerMutation) =>
    preachingPartnerMutate(mutation, get(userLocalUIDState))
);

export const partnerCanCreateState = atom((get) =>
  get(personsActiveState).some(
    (person) => person.person_uid === get(userLocalUIDState)
  )
);

export const preachingPartnerRequestsState = atom((get) => {
  const requests = get(preachingPartnerRequestsDbState);
  const persons = get(personsActiveState);

  const today = get(partnerTodayState);

  // a request whose publisher is gone has nobody to arrange with
  const listed = requests.filter(
    (record) =>
      !record.request_data._deleted &&
      record.request_data.date >= today &&
      persons.some(
        (person) => person.person_uid === record.request_data.person_uid
      )
  );

  return preachingPartnerSort(listed);
});

// my own requests plus the ones I arranged to join, in one running order
export const myPreachingPartnerRequestsState = atom((get) => {
  const requests = get(preachingPartnerRequestsState);
  const uid = get(userLocalUIDState);

  return requests.filter(
    (record) =>
      record.request_data.person_uid === uid ||
      record.request_data.partner_uid === uid
  );
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

export const congregationPreachingPartnerCountState = atom(
  (get) => get(congregationPreachingPartnerRequestsState).length
);

export const congregationPreachingPartnerGroupsState = atom((get) => {
  const requests = get(congregationPreachingPartnerRequestsState);
  const filters = get(preachingPartnerFiltersState);
  const persons = get(personsActiveState);

  const filtered = requests.filter((request) =>
    preachingPartnerMatchesFilters(request, filters, persons)
  );

  return preachingPartnerGroupByDate(filtered);
});

// requests of mine somebody has joined, newest arrangement first
export const myArrangedPreachingPartnerRequestsState = atom((get) => {
  const requests = get(myPreachingPartnerRequestsState);
  const uid = get(userLocalUIDState);

  return requests
    .filter(
      (record) =>
        record.request_data.person_uid === uid &&
        record.request_data.partner_uid
    )
    .sort((a, b) =>
      (b.request_data.arranged_at ?? '').localeCompare(
        a.request_data.arranged_at ?? ''
      )
    );
});

export const partnerReadNotificationsState = atom(
  (get) =>
    get(appLocalsState).find(
      (record) => record.id === PARTNER_NOTIFICATION_LOCAL_ID
    )?.partnerNotificationsRead ?? []
);
export const partnerReadNotificationState = atom(
  null,
  (_get, _set, id: string) => preachingPartnerReadNotification(id)
);
