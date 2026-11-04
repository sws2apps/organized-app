import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory, TerritoryAssignment } from '@definition/territory';
import {
  holderText,
  missingPublisher,
  territoryHolderText,
  withGroupHolders,
} from '@features/territories/group_holder';

const assignment = (
  data: Partial<TerritoryAssignment> = {}
): TerritoryAssignment => ({
  id: 'a',
  publisher: 'Anna',
  assignedOn: '01.09.2026',
  serviceYear: 2027,
  months: 1,
  startMonth: 0,
  endMonth: 0,
  ...data,
});

const territory = (
  assignments: TerritoryAssignment[],
  data: Partial<Territory> = {}
): Territory => ({
  id: 't1',
  number: '1',
  name: 'North',
  city: 'Town',
  type: 'door_to_door',
  status: 'in_work',
  categories: [],
  cardLost: false,
  daysSinceCovered: 0,
  households: 40,
  doNotCalls: [],
  assignments,
  ...data,
});

test('a group assignment shows the group first', () => {
  assert.equal(
    holderText({ publisher: 'Max', group: 'Group 3' }),
    'Group 3 · Max'
  );
  assert.equal(holderText({ publisher: '', group: 'Group 3' }), 'Group 3 · ?');
  assert.equal(holderText({ publisher: 'Max' }), 'Max');
  assert.equal(
    territoryHolderText(territory([], { holder: 'Max', holderGroup: 'G' })),
    'G · Max'
  );
  assert.ok(missingPublisher({ publisher: '', group: 'G' }));
  assert.ok(!missingPublisher({ publisher: 'Max', group: 'G' }));
});

test('an old record naming a group moves the name to the group', () => {
  const old = territory(
    [
      assignment({ id: 'a0', publisher: 'Ben', returnedOn: '01.02.2026' }),
      assignment({ id: 'a1', publisher: 'Group 3' }),
    ],
    { holder: 'Group 3' }
  );

  const [migrated] = withGroupHolders([old], ['Group 3']);

  assert.equal(migrated.holder, '');
  assert.equal(migrated.holderGroup, 'Group 3');
  assert.deepEqual(migrated.assignments[0], old.assignments[0]);
  assert.deepEqual(migrated.assignments[1], {
    ...old.assignments[1],
    publisher: '',
    group: 'Group 3',
  });
});

test('the migration runs once and leaves the rest alone', () => {
  const plain = territory([assignment()], { holder: 'Anna' });
  const old = territory([assignment({ publisher: 'Group 3' })], {
    id: 't2',
    holder: 'Group 3',
  });

  const once = withGroupHolders([plain, old], ['Group 3']);
  const twice = withGroupHolders(once, ['Group 3']);

  assert.equal(once[0], plain);
  assert.equal(twice[1], once[1]);
});

test('a filled-in publisher with the group is not migrated again', () => {
  const done = territory([assignment({ publisher: 'Max', group: 'Group 3' })]);

  assert.equal(withGroupHolders([done], ['Group 3'])[0], done);
});
