import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  publicWitnessingNextShift,
  publicWitnessingPublisherEntries,
  publicWitnessingShiftError,
  publicWitnessingLocationEditError,
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

import {
  publicWitnessingBookingError,
  publicWitnessingCapacityError,
} from '@utils/public_witnessing';
import type {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';

const reviewNow = new Date(2030, 0, 1);
const reviewLocation: PublicWitnessingLocationType = {
  location_uid: 'location',
  location_data: {
    _deleted: false,
    updatedAt: '',
    name: 'Market',
    address: '',
    cart_stored_at: '',
    description: '',
    sort_index: 0,
    max_publishers: 2,
    schedule: [
      { weekday: 2, shifts: [{ start_time: '09:00', end_time: '10:00' }] },
    ],
  },
};
const booking = (id: string, person = id): PublicWitnessingArrangementType => ({
  arrangement_uid: id,
  arrangement_data: {
    _deleted: false,
    updatedAt: '',
    location_uid: 'location',
    date: '2030/01/01',
    start_time: '09:00',
    end_time: '10:00',
    created_by: person,
    partner_needed: false,
    publishers: [{ name: 'Alex', person_uid: person }],
  },
});

test('stale location edits cannot overwrite changes or resurrect deleted locations', () => {
  assert.equal(publicWitnessingLocationEditError(undefined), null);
  assert.equal(publicWitnessingLocationEditError(reviewLocation, ''), null);
  assert.equal(
    publicWitnessingLocationEditError(undefined, ''),
    'tr_PWLocationChanged'
  );
  const changed = structuredClone(reviewLocation);
  changed.location_data.updatedAt = '2030-01-01T10:00:00Z';
  assert.equal(
    publicWitnessingLocationEditError(changed, ''),
    'tr_PWLocationChanged'
  );
  changed.location_data._deleted = true;
  assert.equal(
    publicWitnessingLocationEditError(changed),
    'tr_PWLocationChanged'
  );
});

test('current persisted occupancy rejects stale-dialog overbooking but excludes own edit', () => {
  const records = [booking('a'), booking('b')];
  assert.equal(
    publicWitnessingBookingError(
      booking('c'),
      reviewLocation,
      records,
      reviewNow
    ),
    'tr_PWBookingChanged'
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('a'),
      reviewLocation,
      records,
      reviewNow
    ),
    null
  );
  records[1].arrangement_data._deleted = true;
  records[0].arrangement_data.partner_needed = true;
  records[0].arrangement_data.partner_count = 1;
  assert.equal(
    publicWitnessingBookingError(
      booking('c'),
      reviewLocation,
      records,
      reviewNow
    ),
    null
  );
});

test('rejects a person already booked or selected twice without conflating identical names', () => {
  assert.equal(
    publicWitnessingBookingError(
      booking('b', 'a'),
      reviewLocation,
      [booking('a')],
      reviewNow
    ),
    'tr_publicWitnessingDuplicatePublisher'
  );
  const repeated = booking('a');
  repeated.arrangement_data.publishers.push({ name: 'Alex', person_uid: 'a' });
  assert.equal(
    publicWitnessingBookingError(repeated, reviewLocation, [], reviewNow),
    'tr_publicWitnessingDuplicatePublisher'
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('b'),
      reviewLocation,
      [
        {
          ...booking('a'),
          arrangement_data: {
            ...booking('a').arrangement_data,
            partner_needed: true,
            partner_count: 1,
          },
        },
      ],
      reviewNow
    ),
    null
  );
});

test('deleted locations, changed schedules and elapsed shifts reject new bookings', () => {
  assert.equal(
    publicWitnessingBookingError(booking('a'), undefined, [], reviewNow),
    'tr_PWBookingChanged'
  );
  const changed = structuredClone(reviewLocation);
  changed.location_data.schedule = [];
  assert.equal(
    publicWitnessingBookingError(booking('a'), changed, [], reviewNow),
    'tr_PWBookingChanged'
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('a'),
      changed,
      [booking('a')],
      reviewNow
    ),
    'tr_PWBookingChanged'
  );
  changed.location_data._deleted = true;
  assert.equal(
    publicWitnessingBookingError(booking('a'), changed, [], reviewNow),
    'tr_PWBookingChanged'
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('a'),
      reviewLocation,
      [],
      new Date(2030, 0, 1, 10)
    ),
    'tr_PWBookingChanged'
  );
  const cancelled = booking('a');
  cancelled.arrangement_data._deleted = true;
  assert.equal(
    publicWitnessingBookingError(cancelled, undefined, [], reviewNow),
    null
  );
});

test('capacity reductions respect aggregate future bookings and ignore inactive records', () => {
  const location = structuredClone(reviewLocation);
  const records = [booking('a'), booking('b')];
  assert.equal(
    publicWitnessingCapacityError(location, records, reviewNow),
    null
  );
  location.location_data.max_publishers = 1;
  assert.equal(
    publicWitnessingCapacityError(location, records, reviewNow),
    'tr_PWCapacityBelowBookings'
  );
  records[1].arrangement_data._deleted = true;
  assert.equal(
    publicWitnessingCapacityError(location, records, reviewNow),
    null
  );
  records[1].arrangement_data._deleted = false;
  records[1].arrangement_data.location_uid = 'another-location';
  assert.equal(
    publicWitnessingCapacityError(location, records, reviewNow),
    null
  );
  records[1].arrangement_data.location_uid = location.location_uid;
  records[1].arrangement_data.date = '2030/01/02';
  assert.equal(
    publicWitnessingCapacityError(location, records, reviewNow),
    null
  );
  records[1].arrangement_data.date = '2030/01/01';
  assert.equal(
    publicWitnessingCapacityError(location, records, new Date(2030, 0, 1, 10)),
    null
  );
});

test('rejects invalid capacity, empty bookings and impossible partner requests', () => {
  const candidate = booking('a');
  for (const capacity of [0, -1, 1.5, NaN]) {
    const location = structuredClone(reviewLocation);
    location.location_data.max_publishers = capacity;
    assert.equal(
      publicWitnessingBookingError(candidate, location, [], reviewNow),
      'tr_PWBookingChanged'
    );
  }
  candidate.arrangement_data.partner_needed = true;
  for (const count of [undefined, 0, 2, 1.5]) {
    candidate.arrangement_data.partner_count = count;
    assert.equal(
      publicWitnessingBookingError(candidate, reviewLocation, [], reviewNow),
      'tr_PWBookingChanged'
    );
  }
  candidate.arrangement_data.partner_count = 1;
  assert.equal(
    publicWitnessingBookingError(candidate, reviewLocation, [], reviewNow),
    null
  );
  candidate.arrangement_data.publishers = [];
  assert.equal(
    publicWitnessingBookingError(candidate, reviewLocation, [], reviewNow),
    'tr_PWBookingChanged'
  );
});

test('stale join cannot enter a closed shift merely because physical capacity remains', () => {
  const location = structuredClone(reviewLocation);
  location.location_data.max_publishers = 4;
  const seeker = booking('a');
  seeker.arrangement_data.partner_needed = true;
  seeker.arrangement_data.partner_count = 1;
  assert.equal(
    publicWitnessingBookingError(booking('b'), location, [seeker], reviewNow),
    null
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('c'),
      location,
      [seeker, booking('b')],
      reviewNow
    ),
    'tr_PWBookingChanged'
  );
  assert.equal(
    publicWitnessingBookingError(
      booking('b'),
      location,
      [booking('a')],
      reviewNow
    ),
    'tr_PWBookingChanged'
  );
});

import { publicWitnessingDayShifts } from '@utils/public_witnessing';
test('removing a scheduled time preserves bookings until explicitly deleted', () => {
  const record = booking('a');
  const original = structuredClone(record);
  assert.deepEqual(publicWitnessingDayShifts([], [record]), [
    { start_time: '09:00', end_time: '10:00', retired: true },
  ]);
  assert.deepEqual(record, original);

  const location = structuredClone(reviewLocation);
  location.location_data.schedule = [];
  record.arrangement_data._deleted = true;
  assert.equal(
    publicWitnessingBookingError(record, location, [original], reviewNow),
    null
  );
  assert.deepEqual(publicWitnessingDayShifts([], [record]), []);
});

test('end-time changes retain original bookings as retired slots', () => {
  assert.deepEqual(
    publicWitnessingDayShifts(
      [{ start_time: '09:00', end_time: '11:00' }],
      [booking('a'), booking('b')]
    ),
    [{ start_time: '09:00', end_time: '10:00', retired: true }]
  );
  assert.deepEqual(
    publicWitnessingDayShifts(
      [{ start_time: '09:00', end_time: '10:00' }],
      [booking('a')]
    ),
    [{ start_time: '09:00', end_time: '10:00', retired: false }]
  );
});
