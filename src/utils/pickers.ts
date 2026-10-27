import { isValid, startOfDay } from 'date-fns';
import type { PickerDateBounds } from '@definition/pickers';

// Ignore transient year sections (for example 0002 while typing 2026).
const MIN_VALID_YEAR = 1000;

export const isPickerDateAllowed = (
  value: Date | null,
  { minDate, maxDate, disablePast }: PickerDateBounds,
  now = new Date()
): value is Date => {
  if (!value || !isValid(value) || value.getFullYear() < MIN_VALID_YEAR)
    return false;
  const day = startOfDay(value).getTime();
  return (
    (!minDate || !isValid(minDate) || day >= startOfDay(minDate).getTime()) &&
    (!maxDate || !isValid(maxDate) || day <= startOfDay(maxDate).getTime()) &&
    (!disablePast || day >= startOfDay(now).getTime())
  );
};

/** The nearest allowed day to today, without persisting a selection. */
export const getPickerDateDefault = (
  bounds: PickerDateBounds,
  now = new Date()
) => {
  let value = startOfDay(now);
  if (bounds.minDate && isValid(bounds.minDate))
    value = new Date(
      Math.max(value.getTime(), startOfDay(bounds.minDate).getTime())
    );
  if (bounds.maxDate && isValid(bounds.maxDate))
    value = new Date(
      Math.min(value.getTime(), startOfDay(bounds.maxDate).getTime())
    );
  return isPickerDateAllowed(value, bounds, now) ? value : null;
};
