import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory } from '@definition/territory';
import { matchesText } from '@features/territories/text_search';

const territory = {
  number: 'M12',
  name: 'Rheinstraße',
  city: 'Mainz',
  holder: 'Anna Weber',
  categories: ['dogs'],
  notes: 'Gate code 1234\nRussian-speaking families in the east',
} as Territory;

test('number, name, locality, holder and categories match', () => {
  assert.equal(matchesText(territory, 'm12'), true);
  assert.equal(matchesText(territory, 'rhein'), true);
  assert.equal(matchesText(territory, 'mainz'), true);
  assert.equal(matchesText(territory, 'weber'), true);
  assert.equal(matchesText(territory, 'dogs'), true);
  assert.equal(matchesText(territory, 'kreuzberg'), false);
});

test('the territory notes match too, whatever the case', () => {
  assert.equal(matchesText(territory, 'russian'), true);
  assert.equal(matchesText(territory, 'Gate Code'), true);
  assert.equal(
    matchesText({ ...territory, notes: undefined }, 'russian'),
    false
  );
});

test('without a holder or notes nothing breaks', () => {
  const bare = { ...territory, holder: undefined, notes: undefined };

  assert.equal(matchesText(bare, 'm12'), true);
  assert.equal(matchesText(bare, 'undefined'), false);
});
