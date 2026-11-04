import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchesName } from '@features/territories/name_search';

test('any part of any word, whatever the case', () => {
  assert.equal(matchesName('Anna Weber', 'web'), true);
  assert.equal(matchesName('Anna Weber', 'NNA'), true);
  assert.equal(matchesName('Anna Weber', 'ber'), true);
  assert.equal(matchesName('Anna Weber', 'berg'), false);
});

test('the words typed match in any order', () => {
  assert.equal(matchesName('Anna Weber', 'web an'), true);
  assert.equal(matchesName('Anna Weber', 'anna weber'), true);
  assert.equal(matchesName('Anna Weber', 'weber  anna'), true);
  assert.equal(matchesName('Anna Weber', 'anna klein'), false);
});

test('accents, umlauts and ß do not matter either way', () => {
  assert.equal(matchesName('Jürgen Müller', 'muller'), true);
  assert.equal(matchesName('Jurgen Muller', 'müller'), true);
  assert.equal(matchesName('Ána Nuñez', 'ana nun'), true);
  assert.equal(matchesName('Große Straße', 'strasse'), true);
});

test('an empty search matches everyone', () => {
  assert.equal(matchesName('Anna Weber', ''), true);
  assert.equal(matchesName('Anna Weber', '   '), true);
});
