import type { TerritorySharedSettings } from '@definition/territory_sync';
import type { TerritoryGrant } from '@definition/territory_sync';

export class TerritoryPolicyConflict extends Error {}
const same = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);
const mergeGrant = (
  before: TerritoryGrant,
  local: TerritoryGrant,
  remote: TerritoryGrant
) => {
  const merged = { ...remote };
  for (const key of Object.keys(local) as (keyof TerritoryGrant)[]) {
    if (same(local[key], before[key])) continue;
    if (!same(remote[key], before[key]) && !same(remote[key], local[key]))
      throw new TerritoryPolicyConflict();
    Object.assign(merged, { [key]: local[key] });
  }
  return merged;
};
const removeDeletedGrants = (
  before: Map<string, TerritoryGrant>,
  local: TerritoryGrant[],
  result: Map<string, TerritoryGrant>
) => {
  const localIds = new Set(local.map((item) => item.personId));
  for (const previous of before.values()) {
    if (localIds.has(previous.personId)) continue;
    const current = result.get(previous.personId);
    if (current && !same(previous, current))
      throw new TerritoryPolicyConflict();
    result.delete(previous.personId);
  }
};

/** Apply only locally changed permission fields. A stale device must never restore a remotely revoked right. */
export const mergeTerritoryGrants = (
  baseline: TerritoryGrant[] | undefined,
  local: TerritoryGrant[],
  remote: TerritoryGrant[],
  initialize = false
) => {
  if (!baseline && (!initialize || remote.length)) return remote;
  const before = new Map((baseline ?? []).map((item) => [item.personId, item]));
  const result = new Map(remote.map((item) => [item.personId, item]));
  for (const grant of local) {
    const previous = before.get(grant.personId);
    const current = result.get(grant.personId);
    if (!previous) {
      if (!current) result.set(grant.personId, grant);
      continue;
    }
    if (same(previous, grant)) continue;
    if (!current) throw new TerritoryPolicyConflict();
    result.set(grant.personId, mergeGrant(previous, grant, current));
  }
  removeDeletedGrants(before, local, result);
  return [...result.values()].sort((a, b) =>
    a.personId.localeCompare(b.personId)
  );
};

/** Merge independent setting edits and stop when two devices changed the same setting differently. */
export const mergeTerritorySettings = (
  baseline: TerritorySharedSettings | undefined,
  local: TerritorySharedSettings,
  remote: TerritorySharedSettings
): TerritorySharedSettings => {
  if (same(local, remote)) return remote;
  if (!baseline) throw new TerritoryPolicyConflict();
  const result = { ...remote };
  const keys = new Set([
    ...Object.keys(baseline),
    ...Object.keys(local),
  ] as (keyof TerritorySharedSettings)[]);
  for (const key of keys) {
    if (same(local[key], baseline[key])) continue;
    if (!same(remote[key], baseline[key]) && !same(remote[key], local[key]))
      throw new TerritoryPolicyConflict();
    Object.assign(result, { [key]: local[key] });
  }
  return result;
};
