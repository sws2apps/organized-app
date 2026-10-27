import {
  PartnerSyncCache,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';

export const emptyPartnerCache = (): PartnerSyncCache => ({
  requests: [],
  pending: [],
});

// The server snapshot remains intact, so rejected edits can always be discarded.
export const projectPartnerRequests = (cache: PartnerSyncCache) => {
  const requests = new Map(
    cache.requests.map((record) => [record.request_uid, record])
  );
  for (const entry of cache.pending) {
    for (const optimistic of entry.optimistic) {
      const remote = requests.get(optimistic.request_uid);
      if (
        entry.error &&
        remote &&
        (remote.request_data.partner_uid || remote.request_data._deleted)
      )
        continue;
      const record =
        entry.error && remote
          ? {
              ...optimistic,
              request_data: {
                ...optimistic.request_data,
                partner_uid: remote.request_data.partner_uid,
                arranged_at: remote.request_data.arranged_at,
                updatedAt: remote.request_data.updatedAt,
              },
            }
          : optimistic;
      requests.set(record.request_uid, record);
    }
  }
  return [...requests.values()];
};

export const acknowledgePartnerMutation = (
  cache: PartnerSyncCache,
  operationId: string,
  changes: PreachingPartnerRequestType[]
): PartnerSyncCache => {
  const records = new Map(
    cache.requests.map((record) => [record.request_uid, record])
  );
  for (const change of changes) {
    const current = records.get(change.request_uid);
    if (
      !current ||
      change.request_data.updatedAt >= current.request_data.updatedAt
    )
      records.set(change.request_uid, change);
  }
  return {
    ...cache,
    requests: [...records.values()],
    pending: cache.pending.filter(
      (entry) => entry.mutation.operationId !== operationId
    ),
    error: undefined,
  };
};

// A GET started before another tab's acknowledgement must not roll it back.
export const mergePartnerSnapshot = (
  current: PreachingPartnerRequestType[],
  remote: PreachingPartnerRequestType[],
  baseline: PreachingPartnerRequestType[]
) => {
  const records = new Map(remote.map((record) => [record.request_uid, record]));
  const before = new Map(
    baseline.map((record) => [
      record.request_uid,
      record.request_data.updatedAt,
    ])
  );
  for (const record of current) {
    const revision = record.request_data.updatedAt;
    if (
      revision > (before.get(record.request_uid) ?? '') &&
      revision > (records.get(record.request_uid)?.request_data.updatedAt ?? '')
    )
      records.set(record.request_uid, record);
  }
  return [...records.values()];
};

// A poll that only refreshes the sync time must not rewrite the shared tables.
export const partnerCacheUnchanged = (
  previous: PartnerSyncCache,
  next: PartnerSyncCache
) =>
  !!previous.syncedAt === !!next.syncedAt &&
  JSON.stringify({ ...previous, syncedAt: undefined }) ===
    JSON.stringify({ ...next, syncedAt: undefined });
