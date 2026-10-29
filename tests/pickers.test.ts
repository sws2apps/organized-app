import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getPickerDateDefault,
  isPickerDateAllowed,
} from '../src/utils/pickers';

const today = new Date(2026, 9, 27, 16, 42, 33);

test('an empty date starts today at local midnight without mutating the clock', () => {
  const before = today.getTime();
  assert.deepEqual(getPickerDateDefault({}, today), new Date(2026, 9, 27));
  assert.equal(today.getTime(), before);
  assert.deepEqual(
    getPickerDateDefault({}, new Date(2026, 9, 28, 0, 1)),
    new Date(2026, 9, 28)
  );
});

test('the default moves to the nearest bound when today is outside the range', () => {
  const minDate = new Date(2026, 10, 2, 18);
  const maxDate = new Date(2026, 9, 20, 8);
  assert.deepEqual(
    getPickerDateDefault({ minDate }, today),
    new Date(2026, 10, 2)
  );
  assert.deepEqual(
    getPickerDateDefault({ maxDate }, today),
    new Date(2026, 9, 20)
  );
  assert.equal(minDate.getHours(), 18);
  assert.equal(maxDate.getHours(), 8);
});

test('conflicting limits and a past-only range with disablePast have no default', () => {
  assert.equal(
    getPickerDateDefault(
      { minDate: new Date(2026, 10, 2), maxDate: new Date(2026, 9, 20) },
      today
    ),
    null
  );
  assert.equal(
    getPickerDateDefault(
      { disablePast: true, maxDate: new Date(2026, 9, 26) },
      today
    ),
    null
  );
});

test('constraints compare calendar days rather than hidden time components', () => {
  const bounds = {
    minDate: new Date(2026, 9, 27, 23),
    maxDate: new Date(2026, 9, 27, 1),
    disablePast: true,
  };
  assert.deepEqual(getPickerDateDefault(bounds, today), new Date(2026, 9, 27));
  assert.equal(isPickerDateAllowed(new Date(2026, 9, 27), bounds, today), true);
  assert.equal(
    isPickerDateAllowed(new Date(2026, 9, 26), bounds, today),
    false
  );
  assert.equal(
    isPickerDateAllowed(new Date(2026, 9, 28), bounds, today),
    false
  );
});

test('invalid bounds are ignored, but empty and unfinished dates cannot commit', () => {
  const invalid = new Date(NaN);
  assert.deepEqual(
    getPickerDateDefault({ minDate: invalid, maxDate: invalid }, today),
    new Date(2026, 9, 27)
  );
  for (const value of [null, invalid, new Date('0002-10-27T00:00:00')])
    assert.equal(isPickerDateAllowed(value, {}, today), false);
});
