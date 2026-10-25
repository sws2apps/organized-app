import {
  mergeTerritoryGrants,
  mergeTerritorySettings,
  TerritoryPolicyConflict,
} from '@utils/territory_policy';
import {
  dbTerritoryPolicyBaseline,
  TerritoryDraftChangedError,
  dbTerritorySyncDiscard,
  dbTerritorySettingsSave,
  dbTerritorySyncGet,
  dbTerritorySyncPrepare,
  dbTerritorySyncApply,
  dbTerritoriesEnqueue,
} from '@services/dexie/territory_sync';
import {
  territorySharedSettingsState,
  territoryServerAccessState,
} from '@states/territories';
import type {
  TerritorySharedSettings,
  TerritorySyncStatus,
  TerritoryPendingOperation,
  TerritorySnapshot,
  TerritoryPendingReview,
} from '@definition/territory_sync';

import {
  decryptTerritoryContent,
  decodeTerritory,
  encryptTerritoryContent,
  territoryRemoteId,
  TerritoryIdentityError,
} from '@services/app/territory_codec';
import { store } from '@states/index';
import { userIDState, isOnlineState } from '@states/app';
import {
  congIDState,
  congAccessCodeState,
  congDataSyncState,
  userLocalUIDState,
} from '@states/settings';
import {
  territorySyncPendingState,
  territorySyncStatusState,
} from '@states/territory_sync';
import { territoryAssigneesState } from '@features/territories/assignees';
import {
  apiGetTerritories,
  apiSendTerritories,
  apiSetTerritoryPolicy,
  TerritoryApiError,
} from '@services/api/territories';

import { dbTerritoriesGetAll } from '@services/dexie/territories';

import { prepareTerritoryCommands } from '@services/app/territory_commands';
import {
  buildTerritoryGrants,
  isTerritorySyncManager,
} from '@services/app/territory_policy';
import { isTest, TERRITORY_SYNC_BATCH_LIMIT } from '@constants/index';

import type { TerritoryRecord } from '@definition/territory_record';

const scopeNow = () => `${store.get(congIDState)}:${store.get(userIDState)}`;
const assertAccount = (scope: string) => {
  if (scope !== scopeNow()) throw new TerritoryApiError(403);
};
const localSnapshot = (
  snapshot: TerritorySnapshot,
  key: string
): TerritoryRecord[] => {
  const assignees = store.get(territoryAssigneesState);
  return snapshot.records
    .filter((record) => !record.deleted)
    .map((record) => {
      const data = decodeTerritory(record, assignees, key);
      if (territoryRemoteId(record.dataView, data.id) !== record.id)
        throw new TerritoryIdentityError('Territory identifier does not match');
      return {
        id: `${record.dataView}:${data.id}`,
        dataView: record.dataView,
        updatedAt: record.updatedAt,
        deleted: false,
        data,
        remote: record,
      };
    });
};
const applySnapshot = async (
  scope: string,
  key: string,
  snapshot: TerritorySnapshot,
  acknowledged?: string
) => {
  assertAccount(scope);
  const grant = snapshot.policy.grants.find(
    (item) => item.personId === store.get(userLocalUIDState)
  );
  store.set(territoryServerAccessState, {
    scope,
    manager: snapshot.manager === true,
    eligible: grant?.eligible ?? false,
    access: grant?.access ?? 'own',
    groupIds: grant?.groupIds ?? [],
    restricted: {
      categories: grant?.restrictedCategories ?? [],
      types: grant?.restrictedTypes ?? [],
    },
  });
  await dbTerritorySyncApply(
    scope,
    snapshot.revision,
    localSnapshot(snapshot, key),
    acknowledged,
    snapshot.manager === true
  );
};
const prepare = (
  operation: TerritoryPendingOperation,
  snapshot: TerritorySnapshot,
  key: string
) => {
  const manager = snapshot.manager === true && isTerritorySyncManager();
  const assignees = store.get(territoryAssigneesState);
  const commands = operation.changes.flatMap((change) => {
    const territory = change.after ?? change.before;
    if (!territory) throw new TerritoryIdentityError('Territory data missing');
    const id = territoryRemoteId(change.dataView, territory.id);
    const remote = snapshot.records.find((item) => item.id === id);
    if ((remote?.revision ?? 0) !== change.baseRevision || remote?.deleted)
      throw new TerritoryApiError(409);
    return prepareTerritoryCommands(change, manager, assignees, key).map(
      (command) => ({ id, command })
    );
  });
  if (commands.length > TERRITORY_SYNC_BATCH_LIMIT)
    throw new TerritoryApiError(413);
  return {
    operationId: operation.id,
    expectedRevision: snapshot.revision,
    commands,
  };
};
const synchronizePolicy = async (
  scope: string,
  snapshot: TerritorySnapshot,
  key: string
) => {
  assertAccount(scope);
  const state = await dbTerritorySyncGet();
  const sentSettings =
    state?.settings ?? store.get(territorySharedSettingsState);
  const remote = snapshot.policy.content
    ? decryptTerritoryContent<Partial<TerritorySharedSettings>>(
        snapshot.policy.content,
        key
      )
    : {};
  if (!snapshot.manager || !isTerritorySyncManager()) {
    if (state?.settingsDirty) throw new TerritoryPolicyConflict();
    if (remote.categories)
      await dbTerritorySettingsSave(scope, remote as TerritorySharedSettings, {
        dirty: false,
      });
    return snapshot;
  }
  let settings: TerritorySharedSettings | undefined = remote.categories
    ? (remote as TerritorySharedSettings)
    : store.get(territorySharedSettingsState);
  if (state?.settingsDirty && state.settings)
    settings = remote.categories
      ? mergeTerritorySettings(
          state.settingsBaseline,
          state.settings,
          remote as TerritorySharedSettings
        )
      : state.settings;
  if (!settings)
    throw new TerritoryIdentityError('Territory settings are unavailable');
  const localGrants = buildTerritoryGrants();
  if (!localGrants.length) return snapshot;
  const grants = mergeTerritoryGrants(
    state?.localGrants,
    localGrants,
    snapshot.policy.grants,
    snapshot.policy.revision === 0
  );
  if (
    !state?.settingsDirty &&
    remote.categories &&
    JSON.stringify(grants) === JSON.stringify(snapshot.policy.grants)
  ) {
    await dbTerritorySettingsSave(scope, settings, { dirty: false });
    await dbTerritoryPolicyBaseline(scope, localGrants);
    return snapshot;
  }
  await apiSetTerritoryPolicy(scope, {
    revision: snapshot.policy.revision,
    grants,
    content: encryptTerritoryContent(settings, key),
  });
  assertAccount(scope);
  await dbTerritorySettingsSave(scope, settings, {
    dirty: false,
    sent: sentSettings,
  });
  await dbTerritoryPolicyBaseline(scope, localGrants);
  return apiGetTerritories(scope);
};
const migrateLocal = async (scope: string, snapshot: TerritorySnapshot) => {
  if (!snapshot.manager || !isTerritorySyncManager()) return;
  const state = await dbTerritorySyncGet();
  const pending = new Set(
    state?.queue.flatMap((item) => item.changes.map((change) => change.id))
  );
  const remote = new Set(snapshot.records.map((item) => item.id));
  const local = (await dbTerritoriesGetAll()).filter(
    (item) =>
      !item.remote &&
      !item.deleted &&
      !pending.has(item.id) &&
      !remote.has(territoryRemoteId(item.dataView, item.data.id))
  );
  // Enqueue batches in order: each transaction reads and updates the same persisted outbox.
  // User map operations stay atomic in their original queue entry.
  for (let index = 0; index < local.length; index += TERRITORY_SYNC_BATCH_LIMIT)
    await dbTerritoriesEnqueue(
      local.slice(index, index + TERRITORY_SYNC_BATCH_LIMIT),
      scope
    );
};
const sendOperation = async (
  scope: string,
  key: string,
  operation: TerritoryPendingOperation,
  snapshot?: TerritorySnapshot
) => {
  const prepared =
    operation.prepared ??
    prepare(operation, snapshot ?? (await apiGetTerritories(scope)), key);
  await dbTerritorySyncPrepare(
    scope,
    operation.id,
    prepared,
    operation.changes
  );
  try {
    await apiSendTerritories(scope, prepared);
  } catch (error) {
    if (!(error instanceof TerritoryApiError) || error.status !== 409)
      throw error;
    const current = await apiGetTerritories(scope);
    // Only an unrelated aggregate revision may be retried. A changed territory fails prepare and retains the draft.
    const retry = prepare(operation, current, key);
    await dbTerritorySyncPrepare(scope, operation.id, retry, operation.changes);
    await apiSendTerritories(scope, retry);
  }
};

const run = async () => {
  const scope = scopeNow();
  const key = store.get(congAccessCodeState);
  const state = await dbTerritorySyncGet();
  if (state && state.scope !== scope) throw new TerritoryApiError(403);
  let operation = state?.queue[0];
  // Retry the exact persisted ciphertext before any policy update. The server receipt handles a lost acknowledgement.
  if (operation?.prepared) {
    assertAccount(scope);
    await sendOperation(scope, key, operation);
    await applySnapshot(
      scope,
      key,
      await apiGetTerritories(scope),
      operation.id
    );
  }
  let snapshot = await apiGetTerritories(scope);
  await applySnapshot(scope, key, snapshot);
  const synchronized = await synchronizePolicy(scope, snapshot, key);
  if (synchronized !== snapshot) await applySnapshot(scope, key, synchronized);
  snapshot = synchronized;
  assertAccount(scope);
  await migrateLocal(scope, snapshot);
  operation = (await dbTerritorySyncGet())?.queue[0];
  // Each operation depends on the previous server revision and acknowledged snapshot.
  // Sending these concurrently would create conflicts or replay already-accepted drafts.
  while (operation) {
    assertAccount(scope);
    await sendOperation(scope, key, operation, snapshot);
    snapshot = await apiGetTerritories(scope);
    await applySnapshot(scope, key, snapshot, operation.id);
    operation = (await dbTerritorySyncGet())?.queue[0];
  }
};
const handleSyncError = async (error: unknown, scope: string) => {
  if (scope !== scopeNow()) {
    store.set(territorySyncStatusState, 'idle');
    return;
  }
  if (error instanceof TerritoryDraftChangedError) {
    store.set(territorySyncStatusState, 'pending');
    return;
  }
  let status = error instanceof TerritoryApiError ? error.status : 0;
  if (error instanceof TerritoryPolicyConflict) status = 409;
  if (status === 403) {
    store.set(territoryServerAccessState, {
      scope: scopeNow(),
      manager: false,
      eligible: false,
      access: 'own',
      groupIds: [],
      restricted: { categories: [], types: [] },
    });
    const state = await dbTerritorySyncGet();
    if (state?.scope === scopeNow())
      await dbTerritorySyncApply(state.scope, state.revision, []);
  }
  let nextStatus: TerritorySyncStatus = 'failed';
  if (error instanceof TerritoryIdentityError) nextStatus = 'identity';
  else if (status === 409) nextStatus = 'conflict';
  else if (status === 404) nextStatus = 'unavailable';
  store.set(territorySyncStatusState, nextStatus);
};

let running: Promise<void> | undefined;
const pendingTerritoryCount = async () => {
  const state = await dbTerritorySyncGet().catch(() => undefined);
  return state?.scope === scopeNow()
    ? state.queue.length + Number(!!state.settingsDirty)
    : 0;
};
export const synchronizeTerritories = () => {
  if (running) return running;
  if (
    isTest ||
    !store.get(isOnlineState) ||
    !store.get(congDataSyncState) ||
    !store.get(congAccessCodeState) ||
    !store.get(congIDState) ||
    !store.get(userIDState)
  )
    return Promise.resolve();
  const execute = async () => {
    const scope = scopeNow();
    store.set(territorySyncStatusState, 'syncing');
    try {
      await run();
      store.set(territorySyncStatusState, 'idle');
    } catch (error) {
      await handleSyncError(error, scope);
    } finally {
      store.set(territorySyncPendingState, await pendingTerritoryCount());
    }
  };
  running = (
    navigator.locks
      ? navigator.locks.request('organized-territories', execute)
      : execute()
  ).finally(() => {
    running = undefined;
  });
  return running;
};

export const discardPendingTerritories = async (
  reviewed: TerritoryPendingReview
) => {
  if (running) await running;
  const scope = scopeNow();
  const key = store.get(congAccessCodeState);
  const discard = async () => {
    const snapshot = await apiGetTerritories(scope);
    assertAccount(scope);
    await dbTerritorySyncDiscard(
      scope,
      reviewed,
      localSnapshot(snapshot, key),
      snapshot.revision,
      snapshot.policy.content
        ? decryptTerritoryContent<TerritorySharedSettings>(
            snapshot.policy.content,
            key
          )
        : undefined
    );
    await applySnapshot(scope, key, snapshot);
    store.set(territorySyncPendingState, await pendingTerritoryCount());
    store.set(territorySyncStatusState, 'idle');
  };
  if (navigator.locks)
    await navigator.locks.request('organized-territories', discard);
  else await discard();
};
