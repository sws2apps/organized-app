import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
  PublicWitnessingPublisherType,
  PublicWitnessingShiftType,
} from '@definition/public_witnessing';
import {
  PUBLIC_WITNESSING_LAST_MINUTE_OF_DAY,
  PUBLIC_WITNESSING_DEFAULT_SHIFT_MINUTES,
  PUBLIC_WITNESSING_DEFAULT_START_TIME,
} from '@constants/public_witnessing';

const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

export const publicWitnessingLocationEditError = (
  current: PublicWitnessingLocationType | undefined,
  expectedUpdatedAt?: string
) =>
  current?.location_data._deleted ||
  (expectedUpdatedAt !== undefined &&
    current?.location_data.updatedAt !== expectedUpdatedAt)
    ? 'tr_PWLocationChanged'
    : null;

export const publicWitnessingShiftError = (
  shifts: PublicWitnessingShiftType[]
) => {
  const starts = new Set<string>();
  for (const shift of shifts) {
    if (!isValidTime(shift.start_time) || !isValidTime(shift.end_time)) {
      return 'tr_invalidShiftTime';
    }
    if (shift.end_time <= shift.start_time) return 'tr_shiftEndsBeforeStart';
    if (starts.has(shift.start_time)) return 'tr_duplicateShiftStart';
    starts.add(shift.start_time);
  }
  return null;
};

/** Shifts stay within one day; the last minute requires editing rather than wrapping. */
export const publicWitnessingNextShift = (
  shifts: PublicWitnessingShiftType[]
): PublicWitnessingShiftType => {
  const start_time =
    shifts.at(-1)?.end_time ?? PUBLIC_WITNESSING_DEFAULT_START_TIME;
  const [hours, minutes] = start_time.split(':').map(Number);
  const end = Math.min(
    hours * 60 + minutes + PUBLIC_WITNESSING_DEFAULT_SHIFT_MINUTES,
    PUBLIC_WITNESSING_LAST_MINUTE_OF_DAY
  );
  const end_time = `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
  return { start_time, end_time };
};

export const publicWitnessingPublisherEntries = (
  partners: readonly PublicWitnessingPublisherType[]
): PublicWitnessingPublisherType[] =>
  partners
    .filter((partner) => partner.name.trim().length > 0)
    .map((partner) => ({
      name: partner.name.trim(),
      ...(partner.person_uid ? { person_uid: partner.person_uid } : {}),
    }));

/** Validate against current stored records, not the snapshot used to open a dialog. */
export const publicWitnessingBookingError = (
  arrangement: PublicWitnessingArrangementType,
  location: PublicWitnessingLocationType | undefined,
  records: PublicWitnessingArrangementType[],
  now = new Date()
) => {
  const data = arrangement.arrangement_data;
  if (data._deleted) return null;
  if (!location || location.location_data._deleted)
    return 'tr_PWBookingChanged';

  const existing = records.find(
    (record) => record.arrangement_uid === arrangement.arrangement_uid
  );
  if (existing?.arrangement_data._deleted) return 'tr_PWBookingChanged';
  const [year, month, day] = data.date.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const [hour, minute] = data.end_time.split(':').map(Number);
  const ends = new Date(year, month - 1, day, hour, minute);
  if (
    !Number.isFinite(ends.getTime()) ||
    ends <= now ||
    publicWitnessingShiftError([data])
  ) {
    return 'tr_PWBookingChanged';
  }
  const scheduled = location.location_data.schedule.some(
    (entry) =>
      entry.weekday === (date.getDay() || 7) &&
      entry.shifts.some(
        (shift) =>
          shift.start_time === data.start_time &&
          shift.end_time === data.end_time
      )
  );
  if (!scheduled) return 'tr_PWBookingChanged';

  const others = records.filter(
    (record) =>
      !record.arrangement_data._deleted &&
      record.arrangement_uid !== arrangement.arrangement_uid &&
      record.arrangement_data.location_uid === data.location_uid &&
      record.arrangement_data.date === data.date &&
      record.arrangement_data.start_time === data.start_time
  );
  const capacity = location.location_data.max_publishers;
  const occupied = others.reduce(
    (total, record) => total + record.arrangement_data.publishers.length,
    0
  );
  if (
    !data.publishers.length ||
    data.publishers.some((publisher) => !publisher.name.trim()) ||
    !Number.isInteger(capacity) ||
    occupied + data.publishers.length > capacity ||
    (data.partner_needed &&
      (data.partner_count === undefined ||
        !Number.isInteger(data.partner_count) ||
        data.partner_count < 1 ||
        data.partner_count > capacity - occupied - data.publishers.length))
  )
    return 'tr_PWBookingChanged';

  const ids = new Set(
    others
      .flatMap((record) => record.arrangement_data.publishers)
      .map((publisher) => publisher.person_uid)
      .filter(Boolean)
  );
  for (const publisher of data.publishers) {
    if (!publisher.person_uid) continue;
    if (ids.has(publisher.person_uid)) return 'tr_PWDuplicatePublisher';
    ids.add(publisher.person_uid);
  }
  if (
    !existing &&
    others.length > 0 &&
    !publicWitnessingIsSeekingPartner(others, occupied, capacity)
  ) {
    return 'tr_PWBookingChanged';
  }

  return null;
};

export const publicWitnessingIsSeekingPartner = (
  records: PublicWitnessingArrangementType[],
  publisherCount: number,
  capacity: number
) => {
  const wanted = records
    .filter((record) => record.arrangement_data.partner_needed)
    .reduce(
      (total, record) =>
        total +
        record.arrangement_data.publishers.length +
        (record.arrangement_data.partner_count ?? 1),
      0
    );

  return publisherCount < Math.min(wanted, capacity);
};

/** Retain original booked times when either end of the recurring shift changes. */
export const publicWitnessingDayShifts = (
  scheduled: PublicWitnessingShiftType[],
  records: PublicWitnessingArrangementType[]
) => {
  const key = (shift: PublicWitnessingShiftType) =>
    `${shift.start_time}|${shift.end_time}`;
  // A changed end time must not offer a second, overlapping bookable slot.
  // Keep the original slot until its existing arrangements are cancelled.
  const active = records.filter((record) => !record.arrangement_data._deleted);
  const shifts = new Map(
    scheduled
      .filter(
        (shift) =>
          !active.some(
            (record) =>
              record.arrangement_data.start_time === shift.start_time &&
              record.arrangement_data.end_time !== shift.end_time
          )
      )
      .map((shift) => [key(shift), { ...shift, retired: false }])
  );
  for (const record of records) {
    if (record.arrangement_data._deleted) continue;
    const { start_time, end_time } = record.arrangement_data;
    if (!shifts.has(key(record.arrangement_data))) {
      shifts.set(key(record.arrangement_data), {
        start_time,
        end_time,
        retired: true,
      });
    }
  }
  return [...shifts.values()].sort(
    (a, b) =>
      a.start_time.localeCompare(b.start_time) ||
      a.end_time.localeCompare(b.end_time)
  );
};

export const publicWitnessingCapacityError = (
  location: PublicWitnessingLocationType,
  records: PublicWitnessingArrangementType[],
  now = new Date()
) => {
  const occupancy = new Map<string, number>();
  for (const { arrangement_data: data } of records) {
    if (data._deleted || data.location_uid !== location.location_uid) continue;
    const [year, month, day] = data.date.split('/').map(Number);
    const [hour, minute] = data.end_time.split(':').map(Number);
    if (new Date(year, month - 1, day, hour, minute) <= now) continue;
    const key = `${data.date}|${data.start_time}`;
    const count = (occupancy.get(key) ?? 0) + data.publishers.length;
    if (count > location.location_data.max_publishers)
      return 'tr_PWCapacityBelowBookings';
    occupancy.set(key, count);
  }
  return null;
};
