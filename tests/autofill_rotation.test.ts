import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AssignmentCode } from '@definition/assignment';
import { getAutofillRotationPoolSizes } from '@utils/autofill_rotation';

test('skipped people do not inflate a selectable rotation', () => {
  const qualifications = new Map([
    [AssignmentCode.MM_Talk, new Set(['alice', 'bob', 'carol', 'dana'])],
    [AssignmentCode.MM_Prayer, new Set(['bob', 'dana'])],
  ]);
  const sizes = getAutofillRotationPoolSizes(
    qualifications,
    new Set(['alice', 'bob', 'carol'])
  );
  assert.equal(sizes.get(AssignmentCode.MM_Talk), 3);
  assert.equal(sizes.get(AssignmentCode.MM_Prayer), 1);
  assert.equal(qualifications.get(AssignmentCode.MM_Talk)?.size, 4);
});

test('keeps static qualifications separate from one-week availability', () => {
  // Bob is away this week, but still participates in the long-term rotation.
  const qualifications = new Map([
    [AssignmentCode.MM_Talk, new Set(['alice', 'bob'])],
  ]);
  const selectable = new Set(['alice', 'bob']);
  assert.equal(
    getAutofillRotationPoolSizes(qualifications, selectable).get(
      AssignmentCode.MM_Talk
    ),
    2
  );
  assert.equal(
    getAutofillRotationPoolSizes(qualifications, new Set()).get(
      AssignmentCode.MM_Talk
    ),
    0
  );
});
