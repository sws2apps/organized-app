import {
  PublicWitnessingPublisherType,
  PublicWitnessingShiftType,
} from '@definition/public_witnessing';
import {
  PUBLIC_WITNESSING_LAST_MINUTE_OF_DAY,
  PUBLIC_WITNESSING_DEFAULT_SHIFT_MINUTES,
  PUBLIC_WITNESSING_DEFAULT_START_TIME,
} from '@constants/public_witnessing';

const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

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
