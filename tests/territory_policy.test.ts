import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TerritoryGrant } from '../src/definition/territory_sync';
import {
  mergeTerritoryGrants,
  TerritoryPolicyConflict,
} from '../src/utils/territory_policy';
const grant: TerritoryGrant = {
  personId: 'alice',
  eligible: true,
  access: 'request',
  groupIds: [],
  dataViews: ['main'],
  restrictedCategories: [],
  restrictedTypes: [],
};
test('first connection adopts the existing policy instead of publishing stale local rights', () => {
  const remote = [{ ...grant, eligible: false }];
  assert.deepEqual(mergeTerritoryGrants(undefined, [grant], remote), remote);
});
test('changing a restriction does not restore eligibility revoked on another device', () => {
  const merged = mergeTerritoryGrants(
    [grant],
    [{ ...grant, restrictedCategories: ['restricted'] }],
    [{ ...grant, eligible: false }]
  );
  assert.equal(merged[0].eligible, false);
  assert.deepEqual(merged[0].restrictedCategories, ['restricted']);
});
test('simultaneous conflicting access changes require review', () => {
  assert.throws(
    () =>
      mergeTerritoryGrants(
        [grant],
        [{ ...grant, access: 'view' }],
        [{ ...grant, access: 'own' }]
      ),
    TerritoryPolicyConflict
  );
});
test('a removed remote grant cannot be recreated by stale local edits', () => {
  assert.throws(
    () => mergeTerritoryGrants([grant], [{ ...grant, access: 'view' }], []),
    TerritoryPolicyConflict
  );
  assert.deepEqual(mergeTerritoryGrants([grant], [grant], []), []);
});

test('an intentionally empty policy stays empty on a new device', () => {
  assert.deepEqual(mergeTerritoryGrants(undefined, [grant], []), []);
  assert.deepEqual(mergeTerritoryGrants(undefined, [grant], [], true), [grant]);
});

test('removing a local grant preserves unrelated remote grants and detects simultaneous edits', () => {
  const bob = { ...grant, personId: 'bob' };
  assert.deepEqual(mergeTerritoryGrants([grant], [], [grant, bob]), [bob]);
  assert.throws(
    () =>
      mergeTerritoryGrants([grant], [], [{ ...grant, eligible: false }, bob]),
    TerritoryPolicyConflict
  );
});

const preferences = () => ({
  categories: [],
  borderColor: 'red' as const,
  borderDashed: false,
  recommendations: { cooldownMonths: 0, categories: [], types: [] },
  overdueMonths: 4,
});

test('independent manager setting edits merge without replacing the other device settings', async () => {
  const { mergeTerritorySettings } =
    await import('../src/utils/territory_policy');
  const base = preferences();
  const result = mergeTerritorySettings(
    base,
    { ...base, borderColor: 'blue' },
    { ...base, borderDashed: true }
  );
  assert.equal(result.borderColor, 'blue');
  assert.equal(result.borderDashed, true);
});

test('conflicting changes to the same setting require review', async () => {
  const { mergeTerritorySettings } =
    await import('../src/utils/territory_policy');
  const base = preferences();
  assert.throws(
    () =>
      mergeTerritorySettings(
        base,
        { ...base, borderColor: 'blue' },
        { ...base, borderColor: 'green' }
      ),
    TerritoryPolicyConflict
  );
});

test('an acknowledgement rebases later local settings without losing the remote edit', async () => {
  const { mergeTerritorySettings } =
    await import('../src/utils/territory_policy');
  const sent = { ...preferences(), borderColor: 'blue' as const };
  const result = mergeTerritorySettings(
    sent,
    { ...sent, overdueMonths: 6 },
    { ...sent, borderDashed: true }
  );
  assert.equal(result.overdueMonths, 6);
  assert.equal(result.borderDashed, true);
});
