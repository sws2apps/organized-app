import type { Territory } from '@definition/territory';

// what an assign or return sets; other edits made since stay
const FIELDS = [
  'status',
  'holder',
  'holderGroup',
  'daysOut',
  'requestedBy',
  'daysSinceCovered',
  'reviewNeeded',
  'households',
] as const;

// only the open assignment gets closed, so only it goes back; `added` are the new ones
export const revertAssignment = (
  current: Territory,
  before: Territory,
  added: string[],
  after: Territory
): Territory => {
  const reopened = new Map(
    before.assignments
      .filter((item) => !item.returnedOn)
      .map((item) => [item.id, item])
  );

  const affected = new Set([...reopened.keys(), ...added]);
  const expected = new Map(after.assignments.map((item) => [item.id, item]));
  const actual = new Map(current.assignments.map((item) => [item.id, item]));

  // Undo only our action. A later transfer, return, or edit must not be overwritten.
  if (
    FIELDS.some((key) => current[key] !== after[key]) ||
    [...affected].some(
      (id) =>
        JSON.stringify(actual.get(id)) !== JSON.stringify(expected.get(id))
    ) ||
    current.assignments.some(
      (item) => !item.returnedOn && !expected.has(item.id)
    )
  )
    return current;

  return {
    ...current,
    ...Object.fromEntries(FIELDS.map((key) => [key, before[key]])),
    assignments: current.assignments
      .filter((item) => !added.includes(item.id))
      .map((item) => reopened.get(item.id) ?? item),
  };
};
