import { PARTNER_PENDING_LIMIT } from '@constants/preaching_partner';
import {
  PartnerConnection,
  PartnerMutation,
  PartnerSyncCache,
  PartnerWireMutation,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { applyPartnerMutation } from '@services/app/preaching_partner_actions';
import {
  acknowledgePartnerMutation,
  projectPartnerRequests,
  mergePartnerSnapshot,
} from '@utils/preaching_partner_sync';

export type PartnerSyncDependencies = {
  read: () => Promise<PartnerSyncCache>;
  update: <T>(
    reduce: (
      cache: PartnerSyncCache,
      activePersonIds: string[]
    ) => { cache: PartnerSyncCache; result: T }
  ) => Promise<T>;
  request: (
    mutation?: PartnerWireMutation
  ) => Promise<PreachingPartnerRequestType[]>;
  online: () => boolean;
  errorStatus: (error: unknown) => number | undefined;
};

export const partnerSyncError = (status?: number) => {
  if (status === 409) return 'tr_partnerSyncConflict';
  if (status === 400) return 'tr_partnerInvalidRequest';
  if (status === 401 || status === 403) return 'tr_partnerSyncAccess';
  if (status === 404 || status === 405) return 'tr_partnerServiceUnavailable';
  return 'tr_partnerSyncRetry';
};

const stagePartnerMutation = (
  cache: PartnerSyncCache,
  input: PartnerMutation,
  connection: PartnerConnection,
  active: string[],
  operationId: string,
  requiresConfirmation: boolean
) => {
  const existing = cache.pending.find(
    (entry) => entry.mutation.request.request_uid === input.request.request_uid
  );
  if (existing && !existing.error) throw new Error('tr_partnerSyncPending');
  if (!existing && cache.pending.length >= PARTNER_PENDING_LIMIT)
    throw new Error('tr_partnerSyncPending');
  const pending = cache.pending.filter((entry) => entry !== existing);
  if (existing?.mutation.action === 'create' && input.action === 'delete')
    return { cache: { ...cache, pending }, result: input.request };
  const action =
    existing?.mutation.action === 'create' ? 'create' : input.action;
  const mutation = {
    ...structuredClone(input),
    action,
    operationId,
    publisher_uid: connection.actor,
  };
  const records = projectPartnerRequests({ ...cache, pending });
  const changes = applyPartnerMutation(
    records,
    mutation,
    connection.actor,
    active
  );
  return {
    cache: {
      ...cache,
      error: undefined,
      pending: [
        ...pending,
        { mutation, optimistic: requiresConfirmation ? [] : changes },
      ],
    },
    result: changes[0],
  };
};

// Another tab may deliver the durable operation while this tab waits.
const confirmedPartnerRequest = (
  cache: PartnerSyncCache,
  input: PartnerMutation,
  connection: PartnerConnection,
  operationId: string
) => {
  // Another tab may have delivered the same durable operation while this tab waited.
  const pending = cache.pending.find(
    (entry) => entry.mutation.operationId === operationId
  );
  if (pending) throw new Error(pending.error ?? 'tr_partnerSyncRetry');
  const current = cache.requests.find(
    (record) => record.request_uid === input.request.request_uid
  );
  if (
    current &&
    current.request_data.updatedAt !== input.request.request_data.updatedAt
  ) {
    if (input.action === 'cancel' && !current.request_data.partner_uid)
      return current;
    if (
      input.action === 'join' &&
      current.request_data.partner_uid === connection.actor
    )
      return current;
  }
  throw new Error('tr_partnerRequestChanged');
};

export const createPartnerSyncClient = (
  connection: PartnerConnection,
  dependencies: PartnerSyncDependencies
) => {
  let tail: Promise<unknown> = Promise.resolve();
  const serial = <T>(task: () => Promise<T>): Promise<T> => {
    const result = tail.then(task, task);
    tail = result.catch(() => undefined);
    return result;
  };
  const setError = (error: string) =>
    dependencies.update((cache) => ({
      cache: { ...cache, error },
      result: undefined,
    }));

  const sendPending = async () => {
    const completed = new Map<string, PreachingPartnerRequestType[]>();
    while (dependencies.online()) {
      const entry = (await dependencies.read()).pending.find(
        (record) => !record.error
      );
      if (!entry) break;
      try {
        const changes = await dependencies.request(entry.mutation);
        await dependencies.update((cache) => ({
          cache: acknowledgePartnerMutation(
            cache,
            entry.mutation.operationId,
            changes
          ),
          result: undefined,
        }));
        completed.set(entry.mutation.operationId, changes);
      } catch (error) {
        const status = dependencies.errorStatus(error);
        const message = partnerSyncError(status);
        const rejected = status === 400 || status === 409;
        await dependencies.update((cache) => ({
          cache: {
            ...cache,
            error: message,
            pending: cache.pending.map((pending) =>
              pending.mutation.operationId === entry.mutation.operationId &&
              rejected
                ? { ...pending, error: message }
                : pending
            ),
          },
          result: undefined,
        }));
        if (!rejected) break;
      }
    }
    return completed;
  };

  const synchronize = () =>
    serial(async () => {
      if (!dependencies.online())
        return new Map<string, PreachingPartnerRequestType[]>();
      const completed = await sendPending();
      try {
        const baseline = (await dependencies.read()).requests;
        const requests = await dependencies.request();
        await dependencies.update((cache) => ({
          cache: {
            ...cache,
            requests: mergePartnerSnapshot(cache.requests, requests, baseline),
            syncedAt: new Date().toISOString(),
            error: cache.pending.find((entry) => entry.error)?.error,
          },
          result: undefined,
        }));
      } catch (error) {
        await setError(partnerSyncError(dependencies.errorStatus(error)));
      }
      return completed;
    });

  const mutate = async (input: PartnerMutation) => {
    const requiresConfirmation =
      input.action === 'join' || input.action === 'cancel';
    if (requiresConfirmation && !dependencies.online())
      throw new Error('tr_partnerOnlineRequired');
    const operationId = crypto.randomUUID();
    const optimistic = await dependencies.update((cache, active) => {
      return stagePartnerMutation(
        cache,
        input,
        connection,
        active,
        operationId,
        requiresConfirmation
      );
    });
    if (!requiresConfirmation) {
      if (dependencies.online()) void synchronize().catch(() => undefined);
      return optimistic;
    }
    const results = await synchronize();
    const confirmed = results
      .get(operationId)
      ?.find((record) => record.request_uid === input.request.request_uid);
    if (confirmed) return confirmed;
    return confirmedPartnerRequest(
      await dependencies.read(),
      input,
      connection,
      operationId
    );
  };

  const discardFailed = async () => {
    await dependencies.update((cache) => ({
      cache: {
        ...cache,
        pending: cache.pending.filter((entry) => !entry.error),
        error: undefined,
      },
      result: undefined,
    }));
    await synchronize();
  };
  return { mutate, synchronize, discardFailed };
};
