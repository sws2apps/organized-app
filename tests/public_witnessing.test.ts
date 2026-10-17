import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  publicWitnessingNextShift,
  publicWitnessingPublisherEntries,
  publicWitnessingShiftError,
} from '@utils/public_witnessing';

test('shift identities require distinct start times on a day', () => {
  assert.equal(
    publicWitnessingShiftError([
      { start_time: '09:00', end_time: '10:00' },
      { start_time: '09:00', end_time: '11:00' },
    ]),
    'tr_duplicateShiftStart'
  );
  assert.equal(
    publicWitnessingShiftError([
      { start_time: '09:00', end_time: '10:00' },
      { start_time: '10:00', end_time: '11:00' },
    ]),
    null
  );
});

test('rejects malformed, midnight-crossing and non-increasing shifts', () => {
  for (const time of ['24:00', '24:30', '12:60', '9:00', '', 'invalid']) {
    assert.equal(
      publicWitnessingShiftError([{ start_time: '08:00', end_time: time }]),
      'tr_invalidShiftTime'
    );
    assert.equal(
      publicWitnessingShiftError([{ start_time: time, end_time: '23:59' }]),
      'tr_invalidShiftTime'
    );
  }
  for (const end_time of ['09:00', '08:59', '00:30']) {
    assert.equal(
      publicWitnessingShiftError([{ start_time: '09:00', end_time }]),
      'tr_shiftEndsBeforeStart'
    );
  }
});

test('late-day defaults stay inside the supported day', () => {
  assert.deepEqual(
    publicWitnessingNextShift([{ start_time: '22:30', end_time: '23:30' }]),
    { start_time: '23:30', end_time: '23:59' }
  );
  const last = publicWitnessingNextShift([
    { start_time: '23:30', end_time: '23:59' },
  ]);
  assert.equal(last.end_time, '23:59');
  assert.equal(publicWitnessingShiftError([last]), 'tr_shiftEndsBeforeStart');
  assert.equal(
    publicWitnessingShiftError([publicWitnessingNextShift([])]),
    null
  );
});

test('same-name selections retain IDs while typed names remain unlinked', () => {
  assert.deepEqual(
    publicWitnessingPublisherEntries([
      { name: ' Alex Smith ', person_uid: 'person-a' },
      { name: 'Alex Smith', person_uid: 'person-b' },
      { name: 'Alex Smith' },
      { name: '  ' },
    ]),
    [
      { name: 'Alex Smith', person_uid: 'person-a' },
      { name: 'Alex Smith', person_uid: 'person-b' },
      { name: 'Alex Smith' },
    ]
  );
});
