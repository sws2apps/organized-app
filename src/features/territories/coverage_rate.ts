import { elapsedCalendarDuration } from '@utils/territory_dates';
import { millisecondsInDay } from 'date-fns/constants';
import type { Territory } from '@definition/territory';

// dd.mm.yyyy, as stored; kept here so the counts have no app imports
const dayOf = (value?: string) => {
  const [day, month, year] = (value ?? '').split('.').map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

export { isTerritoryCoverage as isCoverage } from '@utils/territory_coverage';
import { isTerritoryCoverage as isCoverage } from '@utils/territory_coverage';

export const returnedWithin = (territory: Territory, start: Date, end: Date) =>
  territory.assignments.some((assignment) => {
    const returned = dayOf(assignment.returnedOn);

    return (
      isCoverage(assignment) &&
      !!returned &&
      returned >= start &&
      returned <= end
    );
  });

export const coverageRate = (
  territories: Territory[],
  { start, end }: { start: Date; end: Date }
) => {
  const total = territories.length;
  const covered = territories.filter((territory) =>
    returnedWithin(territory, start, end)
  ).length;

  return {
    rate: total ? Math.round((covered / total) * 100) : 0,
    covered,
    total,
  };
};

// covered means returned: an open assignment or none at all is no coverage,
// and the stored daysSinceCovered is only a snapshot (3650 after an import)
const lastCoveredTime = (territory: Territory) =>
  Math.max(
    0,
    ...territory.assignments
      .filter((item) => isCoverage(item))
      .map((item) => dayOf(item.returnedOn)?.getTime() ?? 0)
  );

export const coveredDays = (territory: Territory) => {
  const last = lastCoveredTime(territory);
  return last
    ? Math.max(0, Math.round((Date.now() - last) / millisecondsInDay))
    : null;
};

export const coveredDuration = (territory: Territory) => {
  const last = lastCoveredTime(territory);
  return last ? elapsedCalendarDuration(new Date(last)) : null;
};

// never covered sorts as the longest wait
export const coveredAge = (territory: Territory) =>
  coveredDays(territory) ?? Number.MAX_SAFE_INTEGER;
