import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory } from '@definition/territory';
import {
  holderOptions,
  matchesHolder,
} from '@features/territories/holder_filter';

const territory = (id: string, holder: string | undefined, past: string[]) =>
  ({
    id,
    holder,
    assignments: [
      ...past.map((publisher, index) => ({
        id: `${id}-${index}`,
        publisher,
        assignedOn: '01.01.2025',
        returnedOn: '01.03.2025',
      })),
      ...(holder
        ? [{ id: `${id}-open`, publisher: holder, assignedOn: '01.06.2026' }]
        : []),
    ],
  }) as Territory;

const GROUPS = ['Group 10 – Süd', 'Group 3 – Kreuzberg'];

const territories = [
  territory('1', 'Anna Weber', ['Peter Novak']),
  territory('2', 'Anna Weber', []),
  territory('3', 'Group 3 – Kreuzberg', ['Julia Brandt']),
  territory('4', undefined, ['Julia Brandt', 'Group 10 – Süd']),
];

test('everyone named in the territories, groups first, with what they hold now', () => {
  assert.deepEqual(holderOptions(territories, GROUPS), [
    { name: 'Group 3 – Kreuzberg', count: 1, isGroup: true },
    { name: 'Group 10 – Süd', count: 0, isGroup: true },
    { name: 'Anna Weber', count: 2, isGroup: false },
    { name: 'Julia Brandt', count: 0, isGroup: false },
    { name: 'Peter Novak', count: 0, isGroup: false },
  ]);
});

test('a name the group list does not know is a publisher', () => {
  assert.deepEqual(holderOptions(territories, []).at(0), {
    name: 'Anna Weber',
    count: 2,
    isGroup: false,
  });
});

test('blank names from an import are left out', () => {
  assert.deepEqual(holderOptions([territory('5', undefined, [' '])], []), []);
});

const matching = (holder?: string, past?: boolean) =>
  territories
    .filter((item) => matchesHolder(item, holder, past))
    .map((item) => item.id);

test('no holder keeps every territory', () => {
  assert.deepEqual(matching(), ['1', '2', '3', '4']);
});

test('a holder alone finds the territories held now', () => {
  assert.deepEqual(matching('Anna Weber'), ['1', '2']);
  assert.deepEqual(matching('Julia Brandt'), []);
});

test('with the past, earlier territories count too', () => {
  assert.deepEqual(matching('Julia Brandt', true), ['3', '4']);
  assert.deepEqual(matching('Peter Novak', true), ['1']);
  assert.deepEqual(matching('Anna Weber', true), ['1', '2']);
});
