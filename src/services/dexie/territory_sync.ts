import { mergeTerritorySettings } from '@utils/territory_policy';
import type {
  TerritoryPendingReview,
  TerritorySettingsUpdate,
} from '@definition/territory_sync';
import type {
  TerritoryGrant,
  TerritoryPendingChange,
  TerritoryBatch,
  TerritorySyncState,
  TerritorySharedSettings,
} from '@definition/territory_sync';
import { TERRITORY_SYNC_BATCH_LIMIT } from '@constants/index';
import {
  coalesceTerritoryChanges,
  matchesTerritoryReview,
} from '@utils/territory_sync_queue';

import appDb from '@db/appDb';
import type { TerritoryRecord } from '@definition/territory_record';

export class TerritoryDraftChangedError extends Error {}

export const dbTerritorySyncGet = async () =>
  (await appDb.metadata.get(1))?.territorySync;
const assertScope = (state: TerritorySyncState | undefined, scope: string) => {
  if (state && state.scope !== scope)
    throw new Error('Territory account changed');
};
/** Local edits and their outbox entry commit together, including map splits and combinations. */
export const dbTerritoriesEnqueue = async (
  records: TerritoryRecord[],
  scope: string
) => {
  await appDb.transaction('rw', appDb.territories, appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    const state = metadata?.territorySync ?? { scope, queue: [], revision: 0 };
    assertScope(state, scope);
    const previous = await appDb.territories.bulkGet(
      records.map((item) => item.id)
    );
    const changes = records.map((record, index) => ({
      id: record.id,
      dataView: record.dataView,
      before: previous[index]?.data,
      after: record.deleted ? undefined : record.data,
      baseRevision: previous[index]?.remote?.revision ?? 0,
    }));
    if (coalesceTerritoryChanges(state.queue, changes)) {
      state.queue = state.queue.filter(
        (operation) => operation.changes.length > 0
      );
    } else if (
      changes.length > TERRITORY_SYNC_BATCH_LIMIT &&
      previous.every((record) => !record)
    ) {
      for (
        let index = 0;
        index < changes.length;
        index += TERRITORY_SYNC_BATCH_LIMIT
      )
        state.queue.push({
          id: crypto.randomUUID(),
          changes: changes.slice(index, index + TERRITORY_SYNC_BATCH_LIMIT),
        });
    } else state.queue.push({ id: crypto.randomUUID(), changes });
    await appDb.territories.bulkPut(
      records.map((record, index) => ({
        ...record,
        remote: previous[index]?.remote,
      }))
    );
    await appDb.metadata.put({
      ...metadata,
      id: 1,
      metadata: metadata?.metadata ?? {},
      territorySync: state,
    });
  });
};
export const dbTerritorySyncPrepare = async (
  scope: string,
  id: string,
  prepared: TerritoryBatch,
  changes: TerritoryPendingChange[]
) => {
  await appDb.transaction('rw', appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    assertScope(metadata?.territorySync, scope);
    const entry = metadata?.territorySync?.queue.find((item) => item.id === id);
    if (!metadata || !entry)
      throw new Error('Territory operation no longer exists');
    if (JSON.stringify(entry.changes) !== JSON.stringify(changes))
      throw new TerritoryDraftChangedError();
    entry.prepared = prepared;
    await appDb.metadata.put(metadata);
  });
};
const acknowledgeOperation = (
  state: TerritorySyncState,
  acknowledged: string | undefined,
  remote: Map<string, TerritoryRecord>
) => {
  const accepted = state.queue.find((item) => item.id === acknowledged);
  state.queue = state.queue.filter((item) => item.id !== acknowledged);
  if (accepted) {
    const changed = new Set(accepted.changes.map((item) => item.id));
    for (const operation of state.queue) {
      for (const change of operation.changes) {
        if (changed.has(change.id))
          change.baseRevision =
            remote.get(change.id)?.remote?.revision ?? change.baseRevision;
      }
    }
  }
};

/** Replace the authorized remote set, retaining unsent local drafts. Never retain revoked remote records as visible data. */
export const dbTerritorySyncApply = async (
  scope: string,
  revision: number,
  records: TerritoryRecord[],
  acknowledged?: string,
  retainLocalDrafts = false
) => {
  await appDb.transaction('rw', appDb.territories, appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    const state = metadata?.territorySync ?? { scope, revision: 0, queue: [] };
    assertScope(state, scope);
    const remote = new Map(records.map((item) => [item.id, item]));
    acknowledgeOperation(state, acknowledged, remote);
    const pending = new Set(
      state.queue.flatMap((item) => item.changes.map((change) => change.id))
    );
    const local = await appDb.territories.toArray();
    const removed: string[] = [];
    const updated: TerritoryRecord[] = [];
    for (const record of local) {
      const incoming = remote.get(record.id);
      if (!incoming && (record.remote || !retainLocalDrafts))
        removed.push(record.id);
      else if (pending.has(record.id) && incoming)
        updated.push({ ...record, remote: incoming.remote });
    }
    await appDb.territories.bulkDelete(removed);
    await appDb.territories.bulkPut([
      ...updated,
      ...records.filter((item) => !pending.has(item.id)),
    ]);
    state.revision = revision;
    await appDb.metadata.put({
      ...metadata,
      id: 1,
      metadata: metadata?.metadata ?? {},
      territorySync: state,
    });
  });
};

export const dbTerritorySettingsSave = async (
  scope: string,
  settings: TerritorySharedSettings,
  options: TerritorySettingsUpdate = { dirty: true }
) => {
  await appDb.transaction('rw', appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    const state = metadata?.territorySync ?? { scope, queue: [], revision: 0 };
    assertScope(state, scope);
    if (
      !options.dirty &&
      state.settingsDirty &&
      JSON.stringify(state.settings) !== JSON.stringify(settings)
    ) {
      if (!options.sent || !state.settings) return;
      const rebased = mergeTerritorySettings(
        options.sent,
        state.settings,
        settings
      );
      Object.assign(state, {
        settings: rebased,
        settingsBaseline: settings,
        settingsDirty: JSON.stringify(rebased) !== JSON.stringify(settings),
      });
    } else
      Object.assign(state, {
        settings,
        settingsDirty: options.dirty,
        settingsBaseline: options.dirty
          ? (state.settingsBaseline ?? options.baseline)
          : undefined,
      });
    await appDb.metadata.put({
      ...metadata,
      id: 1,
      metadata: metadata?.metadata ?? {},
      territorySync: state,
    });
  });
};

/** Discard only the operations the user reviewed; concurrent local edits are never discarded implicitly. */
export const dbTerritorySyncDiscard = async (
  scope: string,
  reviewed: TerritoryPendingReview,
  records: TerritoryRecord[],
  revision: number,
  settings?: TerritorySharedSettings
) => {
  await appDb.transaction('rw', appDb.territories, appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    const state = metadata?.territorySync;
    assertScope(state, scope);
    if (!state || !metadata || !matchesTerritoryReview(state, reviewed))
      throw new Error('Pending changes changed during review');
    const ids = state.queue.flatMap((item) =>
      item.changes.map((change) => change.id)
    );
    await appDb.territories.bulkDelete(ids);
    await appDb.territories.bulkPut(records);
    await appDb.metadata.put({
      ...metadata,
      territorySync: {
        ...state,
        revision,
        queue: [],
        settings: settings ?? state.settings,
        settingsDirty: false,
        settingsBaseline: undefined,
      },
    });
  });
};

export const dbTerritoryPolicyBaseline = async (
  scope: string,
  localGrants: TerritoryGrant[]
) => {
  await appDb.transaction('rw', appDb.metadata, async () => {
    const metadata = await appDb.metadata.get(1);
    if (!metadata?.territorySync) return;
    assertScope(metadata.territorySync, scope);
    await appDb.metadata.put({
      ...metadata,
      territorySync: { ...metadata.territorySync, localGrants },
    });
  });
};
