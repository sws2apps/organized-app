import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
  PublicWitnessingPublisherType,
  PublicWitnessingShiftType,
  PublicWitnessingWriteContext,
} from '@definition/public_witnessing';
import {
  PUBLIC_WITNESSING_LAST_MINUTE_OF_DAY,
  PUBLIC_WITNESSING_DEFAULT_SHIFT_MINUTES,
  PUBLIC_WITNESSING_DEFAULT_START_TIME,
} from '@constants/public_witnessing';

const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

// new Date() rolls 2026/13/45 over into a real day, so compare the parts back
const parseDateKey = (value: string) => {
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

export const publicWitnessingIsElapsed = (
  date: string,
  end_time: string,
  now = new Date()
) => {
  const [year, month, day] = date.split('/').map(Number);
  const [hour, minute] = end_time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute) <= now;
};

export const publicWitnessingCanManage = (roles: readonly string[]) =>
  roles.some((role) =>
    ['admin', 'coordinator', 'secretary', 'service_overseer'].includes(role)
  );

export const publicWitnessingErrorKey = (error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  return /^(tr|error)_/.test(message) ? message : 'error_app_generic-desc';
};

export const publicWitnessingArrangementWriteError = (
  arrangement: PublicWitnessingArrangementType,
  existing: PublicWitnessingArrangementType | undefined,
  context: PublicWitnessingWriteContext
) => {
  if (context.canManageLocations) return null;
  const data = arrangement.arrangement_data;
  const isAuthor =
    Boolean(context.userUID) &&
    data.created_by === context.userUID &&
    (!existing || existing.arrangement_data.created_by === context.userUID);
  const isListed =
    data._deleted ||
    data.publishers.some((person) => person.person_uid === context.userUID);
  return isAuthor && isListed ? null : 'error_api_unauthorized-request';
};

export const publicWitnessingLocationError = (
  location: PublicWitnessingLocationType
) => {
  const { name, max_publishers, schedule } = location.location_data;
  if (!name.trim()) return 'tr_fillRequiredField';
  if (!Number.isInteger(max_publishers) || max_publishers <= 0) {
    return 'tr_PWInvalidCapacity';
  }
  for (const day of schedule) {
    const error = publicWitnessingShiftError(day.shifts);
    if (error) return error;
  }
  return null;
};

export const publicWitnessingNextSortIndex = (
  locations: readonly PublicWitnessingLocationType[]
) =>
  Math.max(-1, ...locations.map((record) => record.location_data.sort_index)) +
  1;

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
  const date = parseDateKey(data.date);
  if (
    !date ||
    publicWitnessingShiftError([data]) ||
    publicWitnessingIsElapsed(data.date, data.end_time, now)
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
        // counts every partner wanted, those who joined since included
        data.partner_count > capacity - data.publishers.length))
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
    if (ids.has(publisher.person_uid))
      return 'tr_publicWitnessingDuplicatePublisher';
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
  // each request already counts everyone else in the shift, so the largest
  // one is what the shift still has to reach
  const wanted = records
    .filter((record) => record.arrangement_data.partner_needed)
    .reduce(
      (most, record) =>
        Math.max(
          most,
          record.arrangement_data.publishers.length +
            (record.arrangement_data.partner_count ?? 1)
        ),
      0
    );

  // A publisher whose partner cancelled must not hold the shift closed alone.
  const [only] = records;
  const leftAlone =
    records.length === 1 &&
    publisherCount === 1 &&
    Boolean(only.arrangement_data.created_by) &&
    only.arrangement_data.publishers[0]?.person_uid ===
      only.arrangement_data.created_by;

  return (
    publisherCount < Math.min(Math.max(wanted, leftAlone ? 2 : 0), capacity)
  );
};

export const publicWitnessingPartnersStillWanted = (
  existing: PublicWitnessingArrangementType | undefined,
  takenByOthers: number
) =>
  existing?.arrangement_data.partner_needed
    ? Math.max(
        0,
        (existing.arrangement_data.partner_count ?? 1) - takenByOthers
      )
    : 0;

// partner_count is everyone the author asked for, joiners included
export const publicWitnessingPartnerRequest = ({
  existing,
  capacity,
  takenByOthers,
  seeking,
  selected,
  alone,
}: {
  existing: PublicWitnessingArrangementType | undefined;
  capacity: number;
  takenByOthers: number;
  seeking: boolean;
  selected: number;
  alone: boolean;
}) => {
  if (seeking) {
    return { partner_needed: true, partner_count: selected + takenByOthers };
  }

  const asked = existing?.arrangement_data.partner_needed
    ? (existing.arrangement_data.partner_count ?? 1)
    : 0;

  // A request with no seat left to fill stays on the record, so the shift
  // reopens when a joiner cancels.
  if (alone && asked > 0 && capacity > 1) {
    return {
      partner_needed: true,
      partner_count: Math.min(asked, capacity - 1),
    };
  }

  return { partner_needed: false, partner_count: undefined };
};

/** Retain original booked times when either end of the recurring shift changes. */
export const publicWitnessingDayShifts = (
  scheduled: PublicWitnessingShiftType[],
  records: PublicWitnessingArrangementType[]
) => {
  const key = (shift: PublicWitnessingShiftType) =>
    `${shift.start_time}|${shift.end_time}`;
  // A changed time must not offer a second, overlapping bookable slot.
  // Keep the original slot until its existing arrangements are cancelled.
  const scheduledKeys = new Set(scheduled.map(key));
  const retired = records
    .map((record) => record.arrangement_data)
    .filter((data) => !data._deleted && !scheduledKeys.has(key(data)));
  const shifts = new Map(
    scheduled
      .filter(
        (shift) =>
          !retired.some(
            (data) =>
              data.start_time < shift.end_time &&
              shift.start_time < data.end_time
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
        retired: !scheduledKeys.has(key(record.arrangement_data)),
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
    if (publicWitnessingIsElapsed(data.date, data.end_time, now)) continue;
    const key = `${data.date}|${data.start_time}`;
    const count = (occupancy.get(key) ?? 0) + data.publishers.length;
    if (count > location.location_data.max_publishers)
      return 'tr_PWCapacityBelowBookings';
    occupancy.set(key, count);
  }
  return null;
};
