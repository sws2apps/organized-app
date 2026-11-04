import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPartnerSyncClient } from '../src/services/app/preaching_partner_sync_engine';
import {
  emptyPartnerCache,
  partnerCacheUnchanged,
  projectPartnerRequests,
  mergePartnerSnapshot,
} from '../src/utils/preaching_partner_sync';
import { applyPartnerMutation } from '../src/services/app/preaching_partner_actions';
import type {
  PartnerConnection,
  PartnerSyncCache,
  PartnerWireMutation,
  PreachingPartnerRequestType,
} from '../src/definition/preaching_partner';

const request = (owner = 'alice'): PreachingPartnerRequestType => ({
  request_uid: crypto.randomUUID(),
  request_data: {
    person_uid: owner,
    date: '2099/12/31',
    flexible: true,
    type: 0,
    comment: 'A shared request',
    updatedAt: '2026-01-01T00:00:00.000Z',
    _deleted: false,
  },
});
const connection = (actor: string): PartnerConnection => ({
  scope: actor,
  actor,
  userId: actor,
  congregationId: 'cong',
  pocket: true,
  apiHost: 'http://localhost/',
});
const server = () => {
  let records: PreachingPartnerRequestType[] = [];
  const receipts = new Map<string, PreachingPartnerRequestType[]>();
  let writes = 0;
  return {
    get records() {
      return records;
    },
    get writes() {
      return writes;
    },
    setRecords(value: PreachingPartnerRequestType[]) {
      records = structuredClone(value);
    },
    send: async (actor: string, mutation?: PartnerWireMutation) => {
      if (!mutation) return structuredClone(records);
      if (receipts.has(mutation.operationId))
        return structuredClone(receipts.get(mutation.operationId)!);
      try {
        const changes = applyPartnerMutation(records, mutation, actor, [
          'alice',
          'bob',
          'carol',
        ]);
        const map = new Map(
          records.map((record) => [record.request_uid, record])
        );
        changes.forEach((record) => map.set(record.request_uid, record));
        records = [...map.values()];
        receipts.set(mutation.operationId, changes);
        writes++;
        return structuredClone(changes);
      } catch {
        throw Object.assign(new Error('conflict'), { status: 409 });
      }
    },
  };
};
const device = (
  actor: string,
  backend: ReturnType<typeof server>,
  initial = emptyPartnerCache()
) => {
  let cache: PartnerSyncCache = structuredClone(initial);
  let online = false;
  let loseResponse = false;
  let sentOperation = '';
  const sentPayloads: PartnerWireMutation[] = [];
  let nextFailure: Error | undefined;
  let disconnectAfterUpdate = false;
  const client = createPartnerSyncClient(connection(actor), {
    read: async () => structuredClone(cache),
    update: async (update) => {
      const next = update(structuredClone(cache), ['alice', 'bob', 'carol']);
      cache = next.cache;
      if (disconnectAfterUpdate) {
        online = false;
        disconnectAfterUpdate = false;
      }
      return next.result;
    },
    seal: async (mutation) =>
      ({ ...mutation, seal: crypto.randomUUID() }) as PartnerWireMutation,
    request: async (mutation) => {
      if (mutation) {
        sentOperation = mutation.operationId;
        sentPayloads.push(mutation);
      }
      if (mutation && nextFailure) {
        const error = nextFailure;
        nextFailure = undefined;
        throw error;
      }
      const result = await backend.send(actor, mutation);
      if (mutation && loseResponse) {
        loseResponse = false;
        throw new Error('response lost');
      }
      return result;
    },
    online: () => online,
    errorStatus: (error) => (error as { status?: number }).status,
  });
  return {
    client,
    get cache() {
      return cache;
    },
    get sentOperation() {
      return sentOperation;
    },
    sentPayloads,
    connect: () => {
      online = true;
    },
    disconnect: () => {
      online = false;
    },
    failNextMutation: (status?: number) => {
      nextFailure = Object.assign(new Error('delivery failed'), { status });
    },
    disconnectAfterNextUpdate: () => {
      disconnectAfterUpdate = true;
    },
    loseNextResponse: () => {
      loseResponse = true;
    },
  };
};

test('offline creation survives restart and reaches a second publisher after reconnect', async () => {
  const backend = server();
  const alice = device('alice', backend);
  const draft = request();
  await alice.client.mutate({ action: 'create', request: draft });
  assert.equal(backend.writes, 0);
  assert.equal(
    projectPartnerRequests(alice.cache)[0].request_data.comment,
    draft.request_data.comment
  );
  const restored = device('alice', backend, alice.cache);
  restored.connect();
  await restored.client.synchronize();
  assert.equal(restored.cache.pending.length, 0);
  const bob = device('bob', backend);
  bob.connect();
  await bob.client.synchronize();
  assert.equal(bob.cache.requests[0].request_uid, draft.request_uid);
});

test('lost mutation responses retry the original operation id without duplicate writes', async () => {
  const backend = server();
  const alice = device('alice', backend);
  await alice.client.mutate({ action: 'create', request: request() });
  const id = alice.cache.pending[0].mutation.operationId;
  alice.connect();
  alice.loseNextResponse();
  await alice.client.synchronize();
  assert.equal(alice.cache.pending.length, 1);
  await alice.client.synchronize();
  assert.equal(alice.sentOperation, id);
  assert.equal(alice.sentPayloads.length, 2);
  assert.deepEqual(alice.sentPayloads[1], alice.sentPayloads[0]);
  assert.equal(alice.cache.pending.length, 0);
  assert.equal(backend.writes, 1);
});

test('two publishers race to join; only the accepted publisher receives confirmation', async () => {
  const backend = server();
  const shared = request();
  backend.setRecords([shared]);
  const bob = device('bob', backend);
  const carol = device('carol', backend);
  bob.connect();
  carol.connect();
  await Promise.all([bob.client.synchronize(), carol.client.synchronize()]);
  const results = await Promise.allSettled([
    bob.client.mutate({ action: 'join', request: shared }),
    carol.client.mutate({ action: 'join', request: shared }),
  ]);
  assert.equal(
    results.filter((result) => result.status === 'fulfilled').length,
    1
  );
  const rejected = results.find((result) => result.status === 'rejected');
  assert.match(String(rejected?.reason), /tr_partnerRequestChanged/);
  assert.equal(backend.records[0].request_data.partner_uid, 'bob');
  assert.equal(carol.cache.pending.length, 0);
  assert.equal(carol.cache.error, undefined);
});

test('offline joining and cancellation never create a false confirmation', async () => {
  const backend = server();
  const bob = device('bob', backend);
  for (const action of ['join', 'cancel'] as const)
    await assert.rejects(
      bob.client.mutate({ action, request: request() }),
      /tr_partnerOnlineRequired/
    );
  assert.equal(bob.cache.pending.length, 0);
});

test('rejected offline edits retain the draft for review and explicit discard restores the server version', async () => {
  const backend = server();
  const shared = request();
  backend.setRecords([shared]);
  const alice = device('alice', backend);
  alice.connect();
  await alice.client.synchronize();
  alice.disconnect();
  const local = structuredClone(shared);
  local.request_data.comment = 'Keep my offline notes';
  await alice.client.mutate({ action: 'edit', request: local });
  const remote = structuredClone(shared);
  remote.request_data.comment = 'Changed elsewhere';
  remote.request_data.updatedAt = new Date().toISOString();
  backend.setRecords([remote]);
  alice.connect();
  await alice.client.synchronize();
  assert.equal(
    projectPartnerRequests(alice.cache)[0].request_data.comment,
    'Keep my offline notes'
  );
  assert.equal(
    projectPartnerRequests(alice.cache)[0].request_data.updatedAt,
    remote.request_data.updatedAt
  );
  assert.equal(alice.cache.pending[0].error, 'tr_partnerSyncConflict');
  await alice.client.discardFailed();
  assert.equal(
    projectPartnerRequests(alice.cache)[0].request_data.comment,
    'Changed elsewhere'
  );
});

test('reviewing a rejected edit and saving again uses the observed server revision', async () => {
  const backend = server();
  const shared = request();
  backend.setRecords([shared]);
  const alice = device('alice', backend);
  alice.connect();
  await alice.client.synchronize();
  alice.disconnect();
  const local = structuredClone(shared);
  local.request_data.comment = 'Reviewed local text';
  await alice.client.mutate({ action: 'edit', request: local });
  const remote = structuredClone(shared);
  remote.request_data.updatedAt = new Date().toISOString();
  backend.setRecords([remote]);
  alice.connect();
  await alice.client.synchronize();
  alice.disconnect();
  await alice.client.mutate({
    action: 'edit',
    request: projectPartnerRequests(alice.cache)[0],
  });
  alice.connect();
  await alice.client.synchronize();
  assert.equal(backend.records[0].request_data.comment, 'Reviewed local text');
  assert.equal(alice.cache.pending.length, 0);
});

test('a slow GET cannot overwrite a mutation acknowledged while it was in flight', () => {
  const old = request();
  const newer = structuredClone(old);
  newer.request_data.updatedAt = new Date().toISOString();
  assert.deepEqual(mergePartnerSnapshot([newer], [old], [old]), [newer]);
  assert.deepEqual(mergePartnerSnapshot([old], [], [old]), []);
});

test('a rejected edit never changes the calendar details of an arrangement accepted elsewhere', () => {
  const remote = request();
  remote.request_data.partner_uid = 'bob';
  remote.request_data.arranged_at = new Date().toISOString();
  const local = structuredClone(remote);
  local.request_data.comment = 'Unsynced draft notes';
  local.request_data.date = '2099/12/30';
  delete local.request_data.partner_uid;
  const cache: PartnerSyncCache = {
    requests: [remote],
    pending: [
      {
        mutation: {
          operationId: crypto.randomUUID(),
          publisher_uid: 'alice',
          action: 'edit',
          request: local,
        },
        optimistic: [local],
        error: 'tr_partnerSyncConflict',
      },
    ],
  };
  assert.deepEqual(projectPartnerRequests(cache), [remote]);
  assert.equal(
    cache.pending[0].mutation.request.request_data.comment,
    'Unsynced draft notes'
  );
});

test('failed joins and cancellations are never replayed after reconnect or restart', async () => {
  for (const action of ['join', 'cancel'] as const) {
    for (const status of [undefined, 500]) {
      const backend = server();
      const shared = request();
      if (action === 'cancel') shared.request_data.partner_uid = 'bob';
      const own = request('bob');
      backend.setRecords([shared, own]);
      const draft = request('bob');
      const retained = {
        mutation: {
          operationId: crypto.randomUUID(),
          publisher_uid: 'bob',
          action: 'create' as const,
          request: draft,
        },
        optimistic: [draft],
        error: 'tr_partnerSyncConflict',
      };
      const bob = device('bob', backend, {
        ...emptyPartnerCache(),
        pending: [retained],
      });
      bob.connect();
      await bob.client.synchronize();
      bob.failNextMutation(status);
      await assert.rejects(
        bob.client.mutate({
          action,
          request: shared,
          ...(action === 'join'
            ? { withdrawRequestIds: [own.request_uid] }
            : {}),
        }),
        /tr_partnerActionFailed/
      );
      assert.deepEqual(bob.cache.pending, [retained]);
      const restored = device('bob', backend, bob.cache);
      restored.connect();
      await restored.client.synchronize();
      assert.equal(backend.writes, 0);
      assert.deepEqual(backend.records, [shared, own]);
    }
  }
});

test('losing connectivity after staging a confirmation does not queue it for later delivery', async () => {
  for (const action of ['join', 'cancel'] as const) {
    const backend = server();
    const shared = request();
    if (action === 'cancel') shared.request_data.partner_uid = 'bob';
    backend.setRecords([shared]);
    const bob = device('bob', backend);
    bob.connect();
    await bob.client.synchronize();
    bob.disconnectAfterNextUpdate();
    await assert.rejects(
      bob.client.mutate({ action, request: shared }),
      /tr_partnerActionFailed/
    );
    assert.equal(bob.cache.pending.length, 0);
    bob.connect();
    await bob.client.synchronize();
    assert.equal(backend.writes, 0);
  }
});

test('a lost confirmation response is confirmed from the server snapshot without replaying the action', async () => {
  for (const action of ['join', 'cancel'] as const) {
    const backend = server();
    const shared = request();
    if (action === 'cancel') shared.request_data.partner_uid = 'bob';
    backend.setRecords([shared]);
    const bob = device('bob', backend);
    bob.connect();
    await bob.client.synchronize();
    bob.loseNextResponse();
    const confirmed = await bob.client.mutate({ action, request: shared });
    assert.equal(
      confirmed.request_data.partner_uid,
      action === 'join' ? 'bob' : undefined
    );
    assert.equal(bob.cache.pending.length, 0);
    assert.equal(bob.cache.error, undefined);
    assert.deepEqual(bob.cache.requests, backend.records);
    await bob.client.synchronize();
    assert.equal(backend.writes, 1);
  }
});

test('a poll that only refreshes the sync time counts as unchanged', async () => {
  const backend = server();
  backend.setRecords([request()]);
  const alice = device('alice', backend);
  alice.connect();
  await alice.client.synchronize();
  const first = structuredClone(alice.cache);
  await alice.client.synchronize();
  assert.ok(partnerCacheUnchanged(first, alice.cache));
  assert.equal(partnerCacheUnchanged(emptyPartnerCache(), first), false);
  backend.setRecords([...backend.records, request('bob')]);
  await alice.client.synchronize();
  assert.equal(partnerCacheUnchanged(first, alice.cache), false);
});
