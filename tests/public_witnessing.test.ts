import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  publicWitnessingArrangementWriteError,
  publicWitnessingBookingError,
  publicWitnessingCanManage,
  publicWitnessingCapacityError,
  publicWitnessingDayShifts,
  publicWitnessingErrorKey,
  publicWitnessingIsElapsed,
  publicWitnessingIsSeekingPartner,
  publicWitnessingLocationEditError,
  publicWitnessingLocationError,
  publicWitnessingNextShift,
  publicWitnessingNextSortIndex,
  publicWitnessingPartnerRequest,
  publicWitnessingPartnersStillWanted,
  publicWitnessingPublisherEntries,
  publicWitnessingShiftError,
} from '@utils/public_witnessing';
import type {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';

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
  const pair = booking('a');
  pair.arrangement_data.publishers.push({ name: 'Sam' });
  assert.equal(
    publicWitnessingBookingError(booking('b'), location, [pair], reviewNow),
    'tr_PWBookingChanged'
  );
});

test('a publisher left alone by a cancelled partner stays joinable', () => {
  const joiner = booking('b');
  assert.equal(publicWitnessingIsSeekingPartner([joiner], 1, 2), true);
  assert.equal(publicWitnessingIsSeekingPartner([joiner], 1, 1), false);
  assert.equal(
    publicWitnessingBookingError(
      booking('c'),
      reviewLocation,
      [joiner],
      reviewNow
    ),
    null
  );

  const arrangedByAdmin = booking('d', 'someone-else');
  arrangedByAdmin.arrangement_data.created_by = 'admin';
  assert.equal(
    publicWitnessingIsSeekingPartner([arrangedByAdmin], 1, 2),
    false
  );
});

test('a partner request survives being re-saved after someone joined', () => {
  const location = structuredClone(reviewLocation);
  location.location_data.max_publishers = 3;
  const seeker = booking('a');
  seeker.arrangement_data.partner_needed = true;
  seeker.arrangement_data.partner_count = 2;
  const joiner = booking('b');

  assert.equal(
    publicWitnessingBookingError(seeker, location, [seeker, joiner], reviewNow),
    null
  );
  assert.equal(publicWitnessingIsSeekingPartner([seeker, joiner], 2, 3), true);
  assert.equal(
    publicWitnessingIsSeekingPartner([seeker, joiner, booking('c')], 3, 3),
    false
  );

  seeker.arrangement_data.partner_count = 3;
  assert.equal(
    publicWitnessingBookingError(seeker, location, [seeker, joiner], reviewNow),
    'tr_PWBookingChanged'
  );
});

test('rejects dates that are malformed or do not exist', () => {
  // the last two roll over onto the scheduled Tuesday itself
  for (const date of [
    '2030/13/45',
    '2030/02/30',
    '2030-01-01',
    '2030/1/1',
    '2029/12/32',
    '2030/00/32',
  ]) {
    const candidate = booking('a');
    candidate.arrangement_data.date = date;
    assert.equal(
      publicWitnessingBookingError(candidate, reviewLocation, [], reviewNow),
      'tr_PWBookingChanged',
      date
    );
  }
});

test('a shift counts as elapsed from the minute it ends', () => {
  const at = (hour: number, minute: number) =>
    new Date(2030, 0, 1, hour, minute);
  assert.equal(
    publicWitnessingIsElapsed('2030/01/01', '10:00', at(9, 59)),
    false
  );
  assert.equal(
    publicWitnessingIsElapsed('2030/01/01', '10:00', at(10, 0)),
    true
  );
  assert.equal(
    publicWitnessingIsElapsed('2029/12/31', '23:59', at(0, 0)),
    true
  );
  assert.equal(
    publicWitnessingIsElapsed('2030/01/02', '00:01', at(23, 59)),
    false
  );
});

test('only the author or a manager may write a booking', () => {
  const publisher = { userUID: 'a', canManageLocations: false };
  const other = { userUID: 'b', canManageLocations: false };
  const manager = { userUID: 'm', canManageLocations: true };
  const denied = 'error_api_unauthorized-request';
  const own = booking('a');
  const cancelled = structuredClone(own);
  cancelled.arrangement_data._deleted = true;
  cancelled.arrangement_data.publishers = [];
  const hijacked = booking('a', 'b');

  assert.equal(
    publicWitnessingArrangementWriteError(own, undefined, publisher),
    null
  );
  assert.equal(
    publicWitnessingArrangementWriteError(own, own, publisher),
    null
  );
  assert.equal(
    publicWitnessingArrangementWriteError(cancelled, own, publisher),
    null
  );
  assert.equal(publicWitnessingArrangementWriteError(own, own, other), denied);
  assert.equal(
    publicWitnessingArrangementWriteError(cancelled, own, other),
    denied
  );
  assert.equal(
    publicWitnessingArrangementWriteError(hijacked, own, other),
    denied
  );
  assert.equal(
    publicWitnessingArrangementWriteError(booking('x', ''), undefined, {
      userUID: '',
      canManageLocations: false,
    }),
    denied
  );

  const withoutAuthor = booking('a');
  withoutAuthor.arrangement_data.publishers = [{ name: 'Sam' }];
  assert.equal(
    publicWitnessingArrangementWriteError(withoutAuthor, undefined, publisher),
    denied
  );
  assert.equal(
    publicWitnessingArrangementWriteError(withoutAuthor, own, manager),
    null
  );
  assert.equal(
    publicWitnessingArrangementWriteError(hijacked, own, manager),
    null
  );
});

test('location management follows the congregation role', () => {
  for (const role of [
    'admin',
    'coordinator',
    'secretary',
    'service_overseer',
  ]) {
    assert.equal(publicWitnessingCanManage(['publisher', role]), true, role);
  }
  assert.equal(publicWitnessingCanManage(['publisher', 'elder']), false);
  assert.equal(publicWitnessingCanManage([]), false);
});

test('a location needs a name, a whole capacity and valid shifts', () => {
  const change = (
    edit: (data: PublicWitnessingLocationType['location_data']) => void
  ) => {
    const location = structuredClone(reviewLocation);
    edit(location.location_data);
    return publicWitnessingLocationError(location);
  };

  assert.equal(publicWitnessingLocationError(reviewLocation), null);
  assert.equal(
    change((data) => (data.name = '  ')),
    'tr_fillRequiredField'
  );
  for (const capacity of [0, -1, 1.5, NaN]) {
    assert.equal(
      change((data) => (data.max_publishers = capacity)),
      'tr_PWInvalidCapacity'
    );
  }
  assert.equal(
    change((data) =>
      data.schedule.push({
        weekday: 4,
        shifts: [{ start_time: '10:00', end_time: '09:00' }],
      })
    ),
    'tr_shiftEndsBeforeStart'
  );
});

test('a new location sorts after every existing one, also after a deletion', () => {
  const at = (sort_index: number) => {
    const location = structuredClone(reviewLocation);
    location.location_data.sort_index = sort_index;
    return location;
  };
  assert.equal(publicWitnessingNextSortIndex([]), 0);
  assert.equal(publicWitnessingNextSortIndex([at(0), at(1)]), 2);
  assert.equal(publicWitnessingNextSortIndex([at(1), at(2)]), 3);
});

test('only known error keys reach the translation lookup', () => {
  assert.equal(
    publicWitnessingErrorKey(new Error('tr_PWBookingChanged')),
    'tr_PWBookingChanged'
  );
  assert.equal(
    publicWitnessingErrorKey(new Error('error_api_unauthorized-request')),
    'error_api_unauthorized-request'
  );
  assert.equal(
    publicWitnessingErrorKey(new Error('DataError: x')),
    'error_app_generic-desc'
  );
  assert.equal(publicWitnessingErrorKey('boom'), 'error_app_generic-desc');
});

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

test('a changed start time keeps the booked slot and hides the overlapping new one', () => {
  assert.deepEqual(
    publicWitnessingDayShifts(
      [
        { start_time: '09:30', end_time: '10:30' },
        { start_time: '10:30', end_time: '11:30' },
      ],
      [booking('a')]
    ),
    [
      { start_time: '09:00', end_time: '10:00', retired: true },
      { start_time: '10:30', end_time: '11:30', retired: false },
    ]
  );

  // shifts that overlap on purpose stay bookable beside a booking of one
  assert.deepEqual(
    publicWitnessingDayShifts(
      [
        { start_time: '09:00', end_time: '10:00' },
        { start_time: '09:30', end_time: '10:30' },
      ],
      [booking('a')]
    ),
    [
      { start_time: '09:00', end_time: '10:00', retired: false },
      { start_time: '09:30', end_time: '10:30', retired: false },
    ]
  );
});

test('a booking on a still-scheduled shift is never shown as retired', () => {
  const moved = booking('a');
  const live = booking('b');
  live.arrangement_data.start_time = '09:30';
  live.arrangement_data.end_time = '10:30';
  assert.deepEqual(
    publicWitnessingDayShifts(
      [
        { start_time: '09:30', end_time: '10:30' },
        { start_time: '10:00', end_time: '11:00' },
      ],
      [moved, live]
    ),
    [
      { start_time: '09:00', end_time: '10:00', retired: true },
      { start_time: '09:30', end_time: '10:30', retired: false },
      { start_time: '10:00', end_time: '11:00', retired: false },
    ]
  );
});

test('the largest partner request decides how far a shift fills', () => {
  const first = booking('a');
  first.arrangement_data.partner_needed = true;
  first.arrangement_data.partner_count = 2;
  const second = booking('b');
  second.arrangement_data.partner_needed = true;
  second.arrangement_data.partner_count = 2;
  assert.equal(publicWitnessingIsSeekingPartner([first, second], 2, 6), true);
  assert.equal(
    publicWitnessingIsSeekingPartner([first, second, booking('c')], 3, 6),
    false
  );
});

test('confirming a booking unchanged never alters its partner request', () => {
  const seeker = booking('a');
  seeker.arrangement_data.partner_needed = true;
  seeker.arrangement_data.partner_count = 2;
  const request = (takenByOthers: number) => {
    const stillWanted = publicWitnessingPartnersStillWanted(
      seeker,
      takenByOthers
    );
    return publicWitnessingPartnerRequest({
      existing: seeker,
      capacity: 4,
      takenByOthers,
      seeking: stillWanted > 0,
      selected: Math.max(1, stillWanted),
      alone: true,
    });
  };
  const kept = { partner_needed: true, partner_count: 2 };

  assert.equal(publicWitnessingPartnersStillWanted(seeker, 0), 2);
  assert.equal(publicWitnessingPartnersStillWanted(seeker, 1), 1);
  assert.equal(publicWitnessingPartnersStillWanted(seeker, 3), 0);
  assert.equal(publicWitnessingPartnersStillWanted(booking('b'), 0), 0);
  for (const joiners of [0, 1, 2, 3]) {
    assert.deepEqual(request(joiners), kept, `${joiners} joined`);
  }

  // a capacity lowered since only trims the request
  assert.deepEqual(
    publicWitnessingPartnerRequest({
      existing: {
        ...seeker,
        arrangement_data: { ...seeker.arrangement_data, partner_count: 3 },
      },
      capacity: 3,
      takenByOthers: 2,
      seeking: false,
      selected: 1,
      alone: true,
    }),
    { partner_needed: true, partner_count: 2 }
  );
  assert.deepEqual(
    publicWitnessingPartnerRequest({
      existing: seeker,
      capacity: 1,
      takenByOthers: 0,
      seeking: false,
      selected: 1,
      alone: true,
    }),
    { partner_needed: false, partner_count: undefined }
  );

  // someone who only joined never turns into a request
  assert.deepEqual(
    publicWitnessingPartnerRequest({
      existing: booking('b'),
      capacity: 4,
      takenByOthers: 1,
      seeking: false,
      selected: 1,
      alone: true,
    }),
    { partner_needed: false, partner_count: undefined }
  );

  // naming a partner, or arranging it for others, ends the request
  assert.deepEqual(
    publicWitnessingPartnerRequest({
      existing: seeker,
      capacity: 4,
      takenByOthers: 2,
      seeking: false,
      selected: 1,
      alone: false,
    }),
    { partner_needed: false, partner_count: undefined }
  );
  assert.deepEqual(
    publicWitnessingPartnerRequest({
      existing: undefined,
      capacity: 4,
      takenByOthers: 0,
      seeking: true,
      selected: 3,
      alone: true,
    }),
    { partner_needed: true, partner_count: 3 }
  );
});
