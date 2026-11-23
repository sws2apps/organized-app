import { assignmentFromDates } from '../src/utils/territory_dates';
import { holderForReturn } from '../src/features/territories/group_holder';
import {
  encodeTerritoryAssignment,
  decodeTerritory,
  encodeTerritory,
  decryptTerritoryContent,
  territoryRemoteId,
  TerritoryIdentityError,
} from '../src/services/app/territory_codec';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory, TerritoryAssignee } from '../src/definition/territory';

import { prepareTerritoryCommands } from '../src/services/app/territory_commands';

const key = 'local-test-key';
const people: TerritoryAssignee[] = [
  { id: 'alice', name: 'Alice', group: false },
  { id: 'team', name: 'Team', group: true },
];
const territory = (): Territory => ({
  id: 't1',
  number: 'M22',
  name: 'Map',
  city: '',
  type: 'door_to_door',
  status: 'in_work',
  categories: [],
  daysSinceCovered: 30,
  households: 20,
  cardLost: false,
  holder: 'Alice',
  holderId: 'alice',
  holderGroup: 'Team',
  notes: 'Permanent note',
  assignments: [
    {
      id: 'a1',
      publisher: 'Alice',
      publisherId: 'alice',
      group: 'Team',
      groupId: 'team',
      assignedOn: '01.10.2026',
      serviceYear: 2027,
      months: 1,
      startMonth: 1,
      endMonth: 1,
      note: 'Private assignment note',
      card: 'printed',
    },
  ],
  doNotCalls: [
    {
      id: 'd1',
      address: 'Private address',
      date: '01.10.2026',
      addedBy: 'Alice',
    },
  ],
});
const wire = (value: Territory) => {
  const encoded = encodeTerritory(value, 'main', people, key);
  return {
    ...encoded.details,
    id: territoryRemoteId('main', value.id),
    revision: 1,
    updatedAt: '2026-10-25T12:00:00.000Z',
    deleted: false,
    assignment: encoded.assignment,
    history: encoded.history,
    doNotCalls: encoded.doNotCalls,
    requestedBy: encoded.requestedBy,
  };
};
test('migration encrypts private assignment and do-not-call data separately from the map', () => {
  const encoded = wire(territory());
  const map = decryptTerritoryContent<Record<string, unknown>>(
    encoded.content,
    key
  );
  for (const name of [
    'holder',
    'holderId',
    'assignments',
    'doNotCalls',
    'requestedBy',
  ])
    assert.equal(map[name], undefined);
  assert.equal(map.notes, 'Permanent note');
  assert.ok(!JSON.stringify(encoded).includes('Private'));
  const restored = decodeTerritory(encoded, people, key);
  assert.equal(restored.assignments[0].note, 'Private assignment note');
  assert.equal(restored.assignments[0].assignedOn, '01.10.2026');
  assert.equal(restored.holderId, 'alice');
  assert.equal(restored.doNotCalls[0].address, 'Private address');
});
test('stable IDs survive renamed and duplicate publisher names', () => {
  const value = territory();
  const renamed = [...people, { id: 'other', name: 'Alice', group: false }];
  assert.equal(
    encodeTerritory(value, 'main', renamed, key).assignment?.personId,
    'alice'
  );
  const restored = decodeTerritory(
    wire(value),
    [{ id: 'alice', name: 'New name', group: false }],
    key
  );
  assert.equal(restored.holder, 'New name');
  value.assignments[0].publisherId = undefined;
  assert.throws(
    () => encodeTerritory(value, 'main', renamed, key),
    TerritoryIdentityError
  );
});
test('publisher returns use the narrow command and keep the backdated return and note', () => {
  const before = territory();
  const after = structuredClone(before);
  after.assignments[0].returnedOn = '24.10.2026';
  after.assignments[0].note = 'Return findings';
  after.households = 22;
  const commands = prepareTerritoryCommands(
    { id: 'main:t1', dataView: 'main', before, after, baseRevision: 3 },
    false,
    people,
    key
  );
  assert.equal(commands.length, 1);
  const command = commands[0];
  assert.equal(command.action, 'return');
  if (command.action !== 'return') return;
  assert.equal(command.returnedAt, '2026-10-24T00:00:00.000Z');
  assert.equal(command.households, 22);
  assert.equal(decryptTerritoryContent(command.notes!, key), 'Return findings');
  assert.equal(command.expectedRevision, 3);
});
test('private data omitted from a snapshot cannot survive in its visible record', () => {
  const record = wire(territory());
  const restored = decodeTerritory(
    {
      ...record,
      assignment: undefined,
      history: [],
      doNotCalls: [],
      privateContent: '',
      inUse: true,
    },
    people,
    key
  );
  assert.equal(restored.holder, undefined);
  assert.equal(restored.doNotCalls.length, 0);
  assert.equal(restored.status, 'in_work');
  assert.equal(restored.assignedElsewhere, true);
});
test('invalid calendar dates fail migration instead of silently moving assignments', () => {
  const value = territory();
  value.assignments[0].assignedOn = '31.02.2026';
  assert.throws(() => wire(value), TerritoryIdentityError);
});

test('changing the recorded publisher clears stale identity before encoding', () => {
  const original = territory().assignments[0];
  const changed = assignmentFromDates(
    original,
    'Bob',
    new Date(2026, 9, 1),
    new Date(2026, 9, 25)
  );
  assert.equal(changed.publisherId, undefined);
  const encoded = encodeTerritoryAssignment(
    changed,
    [...people, { id: 'bob', name: 'Bob', group: false }],
    key
  );
  assert.equal(encoded.personId, 'bob');
  assert.equal(
    assignmentFromDates(original, 'Alice', new Date(2026, 9, 1), null)
      .publisherId,
    'alice'
  );
});

test('return and reassign resolves the new publisher ID while retaining the group', () => {
  const original = territory().assignments[0];
  const publishers = [...people, { id: 'bob', name: 'Bob', group: false }];
  const holder = holderForReturn(original, 'Bob', publishers);
  assert.equal(holder?.publisherId, 'bob');
  assert.equal(holder?.groupId, 'team');
  assert.equal(
    holderForReturn(original, 'Alice', publishers)?.publisherId,
    'alice'
  );
  assert.equal(
    holderForReturn(original, 'Bob', [
      ...publishers,
      { id: 'bob-2', name: 'Bob', group: false },
    ]),
    undefined
  );
});

test('historical groups that no longer exist retain their encrypted labels without blocking migration', () => {
  const value = territory();
  value.assignments[0].returnedOn = '24.10.2026';
  value.assignments[0].group = 'Retired group';
  value.assignments[0].groupId = undefined;
  const record = wire(value);
  assert.equal(record.history[0].groupId, 'legacy_a1_group');
  assert.equal(
    decodeTerritory(record, people, key).assignments[0].group,
    'Retired group'
  );
});

test('ambiguous historical do-not-call authors never grant ownership to the first matching name', () => {
  const value = territory();
  const duplicate = [
    ...people,
    { id: 'other-alice', name: 'Alice', group: false },
  ];
  const encoded = encodeTerritory(value, 'main', duplicate, key);
  assert.equal(encoded.doNotCalls[0].addedBy, 'legacy_d1');
});
