import type { Territory } from '@definition/territory';

export type HolderOption = { name: string; isGroup: boolean; count: number };

// everyone the territories name, holding one now or only in their history
export const holderOptions = (
  territories: Territory[],
  groups: string[]
): HolderOption[] => {
  const counts = new Map<string, number>();

  for (const territory of territories) {
    for (const assignment of territory.assignments) {
      for (const name of [assignment.publisher, assignment.group ?? '']) {
        if (!counts.has(name)) counts.set(name, 0);
      }
    }

    for (const name of [territory.holder, territory.holderGroup]) {
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([name]) => name.trim())
    .map(([name, count]) => ({ name, count, isGroup: groups.includes(name) }))
    .sort(
      (a, b) =>
        Number(b.isGroup) - Number(a.isGroup) ||
        a.name.localeCompare(b.name, undefined, { numeric: true })
    );
};

export const matchesHolder = (
  territory: Territory,
  holder?: string,
  past = false
) =>
  !holder ||
  territory.holder === holder ||
  territory.holderGroup === holder ||
  (past &&
    territory.assignments.some(
      (assignment) =>
        assignment.publisher === holder || assignment.group === holder
    ));
