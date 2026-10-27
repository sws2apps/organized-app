import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { store } from '@states/index';
import {
  dismissUndo,
  offerUndo,
  undoLast,
  undoOfferState,
  UNDO_SHOWN_FOR,
} from '@features/territories/undo';

beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
afterEach(() => {
  dismissUndo();
  mock.timers.reset();
});

test('an offer is shown, and undo reverts it once', () => {
  let reverted = 0;
  offerUndo({ text: '5 returned', revert: () => (reverted += 1) });
  assert.equal(store.get(undoOfferState)?.text, '5 returned');

  undoLast();
  undoLast();
  assert.equal(reverted, 1);
  assert.equal(store.get(undoOfferState), undefined);
});

test('a new offer replaces the last, which can no longer be undone', () => {
  const reverted: string[] = [];
  offerUndo({ text: 'first', revert: () => reverted.push('first') });
  offerUndo({ text: 'second', revert: () => reverted.push('second') });
  assert.equal(store.get(undoOfferState)?.text, 'second');

  undoLast();
  assert.deepEqual(reverted, ['second']);
});

test('an offer expires, and its time starts again with a new one', () => {
  let reverted = false;
  offerUndo({ text: 'first', revert: () => {} });
  mock.timers.tick(UNDO_SHOWN_FOR - 1000);
  offerUndo({ text: 'second', revert: () => (reverted = true) });
  mock.timers.tick(UNDO_SHOWN_FOR - 1000);
  assert.equal(store.get(undoOfferState)?.text, 'second');

  mock.timers.tick(1000);
  assert.equal(store.get(undoOfferState), undefined);
  undoLast();
  assert.equal(reverted, false);
});

test('dismissed, nothing is reverted', () => {
  let reverted = false;
  offerUndo({ text: 'gone', revert: () => (reverted = true) });
  dismissUndo();
  undoLast();
  assert.equal(reverted, false);
});
