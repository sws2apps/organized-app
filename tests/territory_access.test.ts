import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory } from '../src/definition/territory';
import type { TerritoryAccessContext } from '../src/definition/territory_access';
import {
  publisherTerritoryChanges,
  territoryHistoryForPublisher,
  territoryPermissions,
} from '../src/services/app/territory_access';

const context = (
  changes: Partial<TerritoryAccessContext> = {}
): TerritoryAccessContext => ({
  editor: false,
  publisher: 'Publisher A',
  eligiblePublisher: true,
  access: 'request',
  restricted: { categories: ['restricted'], types: ['business'] },
  ...changes,
});
const territory = (changes: Partial<Territory> = {}): Territory => ({
  id: 'territory-a',
  number: 'M22',
  name: '',
  city: '',
  type: 'door_to_door',
  status: 'available',
  categories: [],
  daysSinceCovered: 0,
  households: 10,
  cardLost: false,
  doNotCalls: [],
  assignments: [],
  ...changes,
});

for (const access of ['own', 'view', 'request'] as const) {
  test(`${access}: available territory discovery and request rights`, () => {
    const permissions = territoryPermissions(territory(), context({ access }));
    assert.equal(permissions.view, access !== 'own');
    assert.equal(permissions.request, access === 'request');
    assert.equal(permissions.private, false);
    assert.equal(permissions.return, false);
  });
}

test('a direct link does not bypass category or type restrictions', () => {
  for (const record of [
    territory({ categories: ['restricted'] }),
    territory({ type: 'business' }),
  ]) {
    const permissions = territoryPermissions(record, context());
    assert.equal(permissions.view, false);
    assert.equal(permissions.request, false);
  }
});

test('another publisher’s assignment is neither visible nor returnable', () => {
  const permissions = territoryPermissions(
    territory({ holder: 'Publisher B', status: 'in_work' }),
    context()
  );
  assert.equal(permissions.view, false);
  assert.equal(permissions.private, false);
  assert.equal(permissions.return, false);
});

test('an assigned restricted territory remains accessible to its holder', () => {
  const record = territory({
    holder: 'Publisher A',
    status: 'overdue',
    categories: ['restricted'],
  });
  const permissions = territoryPermissions(record, context({ access: 'own' }));
  assert.equal(permissions.view, true);
  assert.equal(permissions.private, true);
  assert.equal(permissions.editDoNotCalls, true);
  assert.equal(permissions.return, false);
  assert.equal(territoryPermissions(record, context()).return, true);
});

test('a request can be withdrawn after the congregation disables requesting', () => {
  const record = territory({ requestedBy: 'Publisher A' });
  const access = context({ access: 'own' });
  assert.equal(territoryPermissions(record, access).view, true);
  assert.equal(territoryPermissions(record, access).cancelRequest, true);
  assert.deepEqual(
    publisherTerritoryChanges(
      record,
      { ...record, requestedBy: undefined },
      access
    ),
    { requestedBy: undefined }
  );
});

test('missing identity never owns unassigned or unrequested records', () => {
  const permissions = territoryPermissions(
    territory({ holder: '', requestedBy: '' }),
    context({ publisher: '', access: 'own' })
  );
  assert.equal(permissions.view, false);
  assert.equal(permissions.private, false);
  assert.equal(permissions.request, false);
  assert.equal(permissions.cancelRequest, false);
});

test('request access does not make an ineligible person a publisher', () => {
  assert.equal(
    territoryPermissions(territory(), context({ eligiblePublisher: false }))
      .request,
    false
  );
});

test('group leads have access only to their group’s assigned territories', () => {
  const record = territory({ holder: 'Group A', status: 'in_work' });
  const permissions = territoryPermissions(
    record,
    context({ groupHolder: 'Group A' })
  );
  assert.equal(permissions.view, true);
  assert.equal(permissions.private, true);
  assert.equal(permissions.return, true);
  assert.equal(permissions.editDoNotCalls, false);
  assert.equal(
    territoryPermissions(record, context({ groupHolder: 'Group B' })).view,
    false
  );
});

test('admins retain management access across publisher restrictions', () => {
  const permissions = territoryPermissions(
    territory({
      holder: 'Publisher B',
      status: 'in_work',
      categories: ['restricted'],
    }),
    context({ editor: true, access: 'own' })
  );
  assert.equal(permissions.view, true);
  assert.equal(permissions.private, true);
  assert.equal(permissions.return, true);
});

test('an already returned territory cannot be returned again from a stale dialog', () => {
  const record = territory({ holder: 'Publisher A' });
  assert.equal(territoryPermissions(record, context()).return, false);
  assert.equal(
    territoryPermissions(record, context({ editor: true })).return,
    false
  );
});

test('a stale request cannot replace a request made by somebody else', () => {
  const current = territory({ requestedBy: 'Publisher B' });
  assert.deepEqual(
    publisherTerritoryChanges(
      current,
      { ...current, requestedBy: 'Publisher A' },
      context()
    ),
    {}
  );
});

test('a publisher cannot change general details, assignments, or another territory', () => {
  const current = territory();
  assert.deepEqual(
    publisherTerritoryChanges(
      current,
      { ...current, number: 'M99', households: 500, holder: 'Publisher A' },
      context()
    ),
    {}
  );
  assert.deepEqual(
    publisherTerritoryChanges(
      current,
      { ...current, id: 'other', requestedBy: 'Publisher A' },
      context()
    ),
    {}
  );
});

test('do-not-call updates preserve other authors and ignore forged authorship', () => {
  const own = {
    id: 'own',
    address: '1 Test Street',
    addedBy: 'Publisher A',
    date: '25.10.2026',
  };
  const other = { ...own, id: 'other', addedBy: 'Publisher B' };
  const current = territory({
    holder: 'Publisher A',
    status: 'in_work',
    doNotCalls: [own, other],
  });
  const next = {
    ...current,
    doNotCalls: [
      { ...other, address: 'Changed', addedBy: 'Publisher A' },
      { ...own, address: 'Corrected address' },
      { ...own, id: 'forged', addedBy: 'Publisher B' },
    ],
  };
  assert.deepEqual(
    publisherTerritoryChanges(current, next, context()).doNotCalls,
    [other, { ...own, address: 'Corrected address' }]
  );
  assert.deepEqual(
    publisherTerritoryChanges(
      { ...current, holder: 'Publisher B' },
      next,
      context()
    ),
    {}
  );
});

test('personal history contains only the current publisher’s assignments', () => {
  const assignments = ['Publisher A', 'Publisher B'].map((publisher) => ({
    id: publisher,
    publisher,
    assignedOn: '01.10.2026',
    returnedOn: '02.10.2026',
    serviceYear: 2027,
    months: 1,
    startMonth: 1,
    endMonth: 1,
  }));
  const records = [
    territory({ assignments }),
    territory({ id: 'other', assignments: [assignments[1]] }),
  ];
  const result = territoryHistoryForPublisher(records, 'Publisher A');
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].assignments, [assignments[0]]);
  assert.equal(records[0].assignments.length, 2);
  assert.deepEqual(territoryHistoryForPublisher(records, ''), []);
  assert.equal(
    territoryPermissions(
      { ...records[0], status: 'in_work', holder: 'Publisher B' },
      context({ access: 'own' })
    ).view,
    false
  );
});

test('an online permission snapshot removes cached manager and group permissions immediately', async () => {
  const { applyTerritoryServerAccess } =
    await import('../src/services/app/territory_access');
  const cached = context({
    editor: true,
    publisherId: 'alice',
    groupId: 'group-a',
    groupHolder: 'Group A',
  });
  const current = applyTerritoryServerAccess(cached, {
    scope: 'cong:alice',
    manager: false,
    eligible: false,
    access: 'own',
    groupIds: [],
    restricted: { categories: ['restricted'], types: ['phone'] },
  });
  assert.equal(current.editor, false);
  assert.equal(current.eligiblePublisher, false);
  assert.equal(current.access, 'own');
  assert.equal(current.groupId, undefined);
  assert.equal(current.groupHolder, undefined);
  assert.deepEqual(current.restricted.types, ['phone']);
});
