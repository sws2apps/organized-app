import type { Territory } from '@definition/territory';

const territoryNumberCollator = new Intl.Collator(undefined, { numeric: true });

export const compareTerritoryNumbers = (first: string, second: string) =>
  territoryNumberCollator.compare(first, second);

export const territoryNumberKey = (number: string) =>
  number.normalize('NFKC').trim().toUpperCase();

// A suffix keeps a new part beside its original without renumbering neighbours.
export const suggestSplitTerritoryNumber = (
  number: string,
  taken: string[]
) => {
  const base = number.trim().replace(/^(.*\d)[A-Z]+$/i, '$1');
  if (!base) return '';

  const used = new Set(taken.map(territoryNumberKey));
  for (let index = 1; ; index++) {
    let value = index;
    let suffix = '';
    while (value > 0) {
      value--;
      suffix = String.fromCodePoint(65 + (value % 26)) + suffix;
      value = Math.floor(value / 26);
    }
    const candidate = `${base}${suffix}`;
    if (!used.has(territoryNumberKey(candidate))) return candidate;
  }
};

// Recheck the live records before committing a staged split or combination.
export const territoryRestructureIssue = (
  territories: Territory[],
  id: string,
  mergedIds: string[],
  created: Territory[],
  number?: string
): 'changed' | 'number' | undefined => {
  const original = territories.find((item) => item.id === id);
  const absorbed = territories.filter((item) => mergedIds.includes(item.id));
  if (!original || absorbed.length !== mergedIds.length) return 'changed';
  const restructuring = created.length > 0 || mergedIds.length > 0;
  const assigned = [original, ...absorbed].some(
    (item) =>
      item.requestedBy ||
      item.requestPending ||
      item.holder ||
      item.holderId ||
      item.holderGroupId ||
      item.assignedElsewhere ||
      item.assignments.some((assignment) => !assignment.returnedOn)
  );
  if (restructuring && assigned) return 'changed';
  const used = new Set(
    territories
      .filter((item) => item.id !== id && !mergedIds.includes(item.id))
      .map((item) => territoryNumberKey(item.number))
  );
  for (const value of [
    number ?? original.number,
    ...created.map((item) => item.number),
  ]) {
    const key = territoryNumberKey(value);
    if (!key || used.has(key)) return 'number';
    used.add(key);
  }
};
