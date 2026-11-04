import type { AssignmentCongregation } from '@definition/schedules';
import type { HallCleaningConfig } from '@definition/hall_cleaning';

export const HALL_CLEANING_GROUP_AMOUNTS = [1, 2, 3, 4, 5, 6] as const;

export const hallCleaningGroupCount = (value = 1) =>
  Number.isInteger(value) ? Math.max(1, Math.min(6, value)) : 1;

export const hallCleaningConfiguredGroupCount = (
  config?: HallCleaningConfig
) =>
  config?.type === 'main' && config.assign_to.value === 'group'
    ? hallCleaningGroupCount(config.group_amount?.value)
    : 1;

export const hallCleaningGroupPosition = (entry: AssignmentCongregation) =>
  Number(entry.id ?? '1');

// The existing first entry has no id. Additional positions use ids 2–6.
// Reading fewer positions never changes or removes stored assignments.
export const hallCleaningGroupEntries = (
  entries: AssignmentCongregation[] | undefined,
  dataView: string,
  count: number
) =>
  Array.from({ length: count }, (_, index) =>
    entries?.find(
      (entry) =>
        entry.type === dataView &&
        hallCleaningGroupPosition(entry) === index + 1
    )
  );

export const hallCleaningRotationOrder = (
  groups: string[],
  turn: number,
  count: number
) => {
  const unique = [...new Set(groups)];
  if (!unique.length) return [];
  const start = (turn * count) % unique.length;
  return [...unique.slice(start), ...unique.slice(0, start)];
};

export const resolveHallCleaningGroups = (
  stored: (AssignmentCongregation | undefined)[],
  automatic: string[],
  valid: (value: string) => boolean
) => {
  const used = new Set<string>();
  const manual = Array.from(stored, (entry) => {
    if (!entry?.value || !valid(entry.value) || used.has(entry.value))
      return undefined;
    used.add(entry.value);
    return entry.value;
  });
  return Array.from(stored, (_, index) => {
    if (manual[index]) return { value: manual[index]!, manual: true };
    const preferred = automatic[index];
    // A removed group leaves its position open, retaining the turn order.
    if (!preferred || !valid(preferred)) return { value: '', manual: false };
    const value = used.has(preferred)
      ? (automatic.find((id) => !used.has(id) && valid(id)) ?? '')
      : preferred;
    if (value) used.add(value);
    return { value, manual: false };
  });
};

export const updateHallCleaningGroupEntry = (
  entries: AssignmentCongregation[],
  entry: AssignmentCongregation,
  position: number
) => {
  if (!Number.isInteger(position) || position < 1 || position > 6)
    throw new RangeError('Invalid group position');
  const index = entries.findIndex(
    (record) =>
      record.type === entry.type &&
      hallCleaningGroupPosition(record) === position
  );
  const result = [...entries];
  const changes = { ...entry };
  delete changes.id;
  if (index >= 0) result[index] = { ...result[index], ...changes };
  else
    result.push({
      ...changes,
      ...(position > 1 ? { id: String(position) } : {}),
    });
  return result;
};
