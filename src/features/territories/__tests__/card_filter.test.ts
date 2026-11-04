import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AssignmentCard, Territory } from '@definition/territory';
import {
  CardFilter,
  cardsOut,
  matchesCard,
  openCard,
} from '@features/territories/card_filter';

const territory = (
  id: string,
  open?: { card?: AssignmentCard },
  past: AssignmentCard[] = []
) =>
  ({
    id,
    assignments: [
      ...past.map((card, index) => ({
        id: `${id}-${index}`,
        publisher: 'Peter Novak',
        assignedOn: '01.01.2025',
        returnedOn: '01.03.2025',
        card,
      })),
      ...(open
        ? [
            {
              id: `${id}-open`,
              publisher: 'Anna Weber',
              assignedOn: '01.06.2026',
              ...open,
            },
          ]
        : []),
    ],
  }) as Territory;

const territories = [
  territory('printed', { card: 'printed' }),
  territory('digital', { card: 'digital' }, ['printed']),
  territory('older', {}),
  territory('available', undefined, ['printed', 'digital']),
];

const matching = (...cards: CardFilter[]) =>
  territories.filter((item) => matchesCard(item, cards)).map((item) => item.id);

test('the open assignment says how the territory is out', () => {
  assert.equal(openCard(territories[0]), 'printed');
  assert.equal(openCard(territories[1]), 'digital');
  assert.equal(openCard(territories[2]), 'unknown');
  assert.equal(openCard(territories[3]), undefined);
});

test('no chip keeps every territory', () => {
  assert.deepEqual(matching(), ['printed', 'digital', 'older', 'available']);
});

test('a chip finds the territories out that way; past cards do not count', () => {
  assert.deepEqual(matching('printed'), ['printed']);
  assert.deepEqual(matching('digital'), ['digital']);
  assert.deepEqual(matching('unknown'), ['older']);
});

test('several chips add up', () => {
  assert.deepEqual(matching('printed', 'unknown'), ['printed', 'older']);
});

test('cards out counts the open assignments that carry the field', () => {
  assert.deepEqual(cardsOut(territories), { digital: 1, printed: 1 });
  assert.deepEqual(cardsOut([territories[2], territories[3]]), {
    digital: 0,
    printed: 0,
  });
});
