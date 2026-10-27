import {
  partnerDemoMode,
  PARTNER_SYNC_LOCAL_ID,
  PARTNER_NOTIFICATION_LOCAL_ID,
} from '@constants/index';
import { appLocalsState } from '@states/app_locals';
/*
This file holds the source of the truth from the table "preaching_partner_requests".
*/

import { atom } from 'jotai';
import {
  PartnerConnection,
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
import {
  accountTypeState,
  congIDState,
  congDataSyncState,
  userLocalUIDState,
} from '@states/settings';
import { apiHostState, userIDState } from '@states/app';
import {
  activatePartnerConnection,
  partnerSyncClient,
} from '@services/app/preaching_partner_sync';
import { emptyPartnerCache } from '@utils/preaching_partner_sync';

export const partnerConnectionState = atom((get): PartnerConnection | null => {
  if (partnerDemoMode || !get(congDataSyncState)) return null;
  const apiHost = get(apiHostState);
  const congregationId = get(congIDState);
  const userId = get(userIDState);
  const actor = get(userLocalUIDState);
  const accountType = get(accountTypeState);
  if (
    !apiHost ||
    !congregationId ||
    !userId ||
    !actor ||
    !['vip', 'pocket'].includes(accountType)
  )
    return null;
  const pocket = accountType === 'pocket';
  return {
    apiHost,
    congregationId,
    userId,
    actor,
    pocket,
    scope: JSON.stringify([apiHost, congregationId, userId, actor, pocket]),
  };
});
export const partnerCacheState = atom((get) => {
  const connection = get(partnerConnectionState);
  const local = get(appLocalsState).find(
    (record) => record.id === PARTNER_SYNC_LOCAL_ID
  )?.partnerSync;
  return connection
    ? (local?.scopes[connection.scope] ?? emptyPartnerCache())
    : emptyPartnerCache();
});
export const partnerReadyState = atom(
  (get) => partnerDemoMode || !!get(partnerCacheState).syncedAt
);
export const partnerSyncState = atom(
  null,
  async (get, _set, activate = false) => {
    const connection = get(partnerConnectionState);
    if (!connection) return;
    if (activate) await activatePartnerConnection(connection);
    else await partnerSyncClient(connection).synchronize();
  }
);
export const partnerDiscardFailedState = atom(null, async (get) => {
  const connection = get(partnerConnectionState);
  if (connection) await partnerSyncClient(connection).discardFailed();
});

// the fast poll runs only while the partner page is open
export const partnerFeatureOpenState = atom(false);

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
  (get, _set, mutation: PartnerMutation) => {
    if (partnerDemoMode)
      return preachingPartnerMutate(mutation, get(userLocalUIDState));
    const connection = get(partnerConnectionState);
    if (!connection || !get(partnerReadyState))
      throw new Error('tr_partnerSyncAccess');
    return partnerSyncClient(connection).mutate(mutation);
  }
);

export const partnerCanCreateState = atom(
  (get) =>
    get(partnerReadyState) &&
    get(personsActiveState).some(
      (person) => person.person_uid === get(userLocalUIDState)
    )
);

export const preachingPartnerRequestsState = atom((get) => {
  const connection = get(partnerConnectionState);
  const activeScope = get(appLocalsState).find(
    (record) => record.id === PARTNER_SYNC_LOCAL_ID
  )?.partnerSync?.activeScope;
  const requests =
    partnerDemoMode || (connection && activeScope === connection.scope)
      ? get(preachingPartnerRequestsDbState)
      : [];
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
