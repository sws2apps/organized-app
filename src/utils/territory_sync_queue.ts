import type { Territory, TerritoryAssignment } from '@definition/territory';
import type {
  TerritoryPendingChange,
  TerritoryPendingReview,
  TerritorySyncState,
  TerritoryPendingOperation,
} from '@definition/territory_sync';

/** Correct an unsent draft in place; never alter ciphertext that may already have reached the server. */
export const coalesceTerritoryChanges = (
  queue: TerritoryPendingOperation[],
  changes: TerritoryPendingChange[]
) => {
  const operation = [...queue]
    .reverse()
    .find(
      (item) =>
        !item.prepared &&
        changes.every((change) =>
          item.changes.some((previous) => previous.id === change.id)
        )
    );
  if (!operation) return false;
  for (const change of changes) {
    const previous = operation.changes.find((item) => item.id === change.id)!;
    previous.after = change.after;
  }
  operation.changes = operation.changes.filter(
    (change) => JSON.stringify(change.before) !== JSON.stringify(change.after)
  );
  return true;
};

/** A coalesced edit can keep its operation ID; compare all reviewed data before discarding. */
export const matchesTerritoryReview = (
  state: TerritorySyncState,
  reviewed: TerritoryPendingReview
) =>
  JSON.stringify({
    queue: state.queue,
    settings: state.settingsDirty ? state.settings : undefined,
  }) === JSON.stringify(reviewed);

export class TerritoryOperationLimitError extends Error {
  constructor() {
    super('Territory change exceeds the sync command limit');
  }
}

/** Plan before encryption so persistence and sending use the same command budget. */
export const territoryPublisherCommandChanges = (
  before: Territory,
  after: Territory
) => {
  const active = before.assignments.find((item) => !item.returnedOn);
  const updated = after.assignments.find((item) => item.id === active?.id);
  let assignment:
    | { action: 'return' | 'assignment_note'; value: TerritoryAssignment }
    | undefined;
  if (active && updated) {
    if (updated.returnedOn) assignment = { action: 'return', value: updated };
    else if (active.note !== updated.note)
      assignment = { action: 'assignment_note', value: updated };
  }
  const doNotCalls = [
    ...after.doNotCalls
      .filter(
        (entry) =>
          JSON.stringify(
            before.doNotCalls.find((item) => item.id === entry.id)
          ) !== JSON.stringify(entry)
      )
      .map((entry) => ({ id: entry.id, value: entry })),
    ...before.doNotCalls
      .filter((entry) => !after.doNotCalls.some((item) => item.id === entry.id))
      .map((entry) => ({ id: entry.id, value: undefined })),
  ];
  const requestAction = after.requestedBy
    ? ('request' as const)
    : ('cancel_request' as const);
  return {
    request:
      before.requestedBy !== after.requestedBy ? requestAction : undefined,
    assignment,
    doNotCalls,
  };
};

/** Only uniform, independent record changes may be split; restructuring stays atomic. */
export const partitionTerritoryChanges = (
  changes: TerritoryPendingChange[],
  manager: boolean,
  limit: number
) => {
  const batches: TerritoryPendingChange[][] = [];
  let batch: TerritoryPendingChange[] = [];
  let count = 0;
  const kinds = new Set(
    changes.map((change) => {
      if (!change.before) return 'create';
      return change.after ? 'update' : 'delete';
    })
  );
  for (const change of changes) {
    const plan =
      !manager && change.before && change.after
        ? territoryPublisherCommandChanges(change.before, change.after)
        : undefined;
    let size = 1;
    if (!manager)
      size = plan
        ? Number(!!plan.request) +
          Number(!!plan.assignment) +
          plan.doNotCalls.length
        : limit + 1;
    if (size > limit) throw new TerritoryOperationLimitError();
    if (count + size > limit) {
      if (kinds.size > 1) throw new TerritoryOperationLimitError();
      batches.push(batch);
      batch = [];
      count = 0;
    }
    batch.push(change);
    count += size;
  }
  if (batch.length) batches.push(batch);
  return batches;
};
