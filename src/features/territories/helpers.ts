import { formatDate } from '@utils/date';
import { getTranslation } from '@services/i18n/translation';
import { GROUPS, PUBLISHERS } from './mockData';
import {
  Territory,
  TerritoryAssignment,
  TerritoryFilters,
  TerritoryRestrictions,
  TerritoryTab,
} from '@definition/territory';

export const EMPTY_FILTERS: TerritoryFilters = {
  search: '',
  status: [],
  type: [],
  categories: [],
  cardLostOnly: false,
};

export const clearedFilters = (
  filters: TerritoryFilters
): TerritoryFilters => ({
  ...EMPTY_FILTERS,
  search: filters.search,
});

export const serviceYear = (date = new Date()) =>
  date.getMonth() >= 8 ? date.getFullYear() + 1 : date.getFullYear();

export const COVERAGE_PERIODS = () => {
  const current = serviceYear();

  return [
    { id: 'last6', label: 'Last 6 months' },
    { id: 'last12', label: 'Last 12 months' },
    { id: `sy${current - 1}`, label: `${current - 1} service year` },
    { id: `sy${current - 2}`, label: `${current - 2} service year` },
  ];
};

const DAY = 86400000;

export const serviceYearBounds = (year: number) => ({
  start: new Date(year - 1, 8, 1),
  end: new Date(year, 7, 31, 23, 59, 59),
});

const periodWindow = (period: string) => {
  const now = new Date();

  if (period === 'last6') {
    return { start: new Date(now.getTime() - 182 * DAY), end: now };
  }

  if (period === 'last12') {
    return { start: new Date(now.getTime() - 365 * DAY), end: now };
  }

  const year = Number(period.replace('sy', ''));
  if (!year) return undefined;

  return serviceYearBounds(year);
};

const returnedWithin = (territory: Territory, start: Date, end: Date) =>
  territory.assignments.some((assignment) => {
    const returned = parseDate(assignment.returnedOn);

    return !!returned && returned >= start && returned <= end;
  });

const matchesCoverage = (
  territory: Territory,
  coverage: TerritoryFilters['coverage']
) => {
  if (!coverage) return true;

  const window = periodWindow(coverage.period);
  if (!window) return true;

  const covered = returnedWithin(territory, window.start, window.end);

  return coverage.covered ? covered : !covered;
};

export const daysLabel = (days?: number) => {
  if (days === undefined) return '–';
  if (days < 31) return `${days} d`;

  const months = Math.round(days / 30);

  if (months < 12) return `${months} mo`;

  const years = Math.floor(months / 12);
  const rest = months % 12;

  return rest === 0 ? `${years} y` : `${years} y ${rest} mo`;
};

// overdue is not stored: it follows from how long the territory has been out
export const withDerivedStatus = (
  territories: Territory[],
  overdueMonths: number
) =>
  territories.map((territory) => {
    if (territory.status === 'available') return territory;

    const overdue = (territory.daysOut ?? 0) > overdueMonths * 30;

    return {
      ...territory,
      status: overdue ? 'overdue' : 'in_work',
    } as Territory;
  });

export const applyFilters = (
  territories: Territory[],
  filters: TerritoryFilters
) =>
  territories.filter((territory) => {
    if (filters.status.length && !filters.status.includes(territory.status)) {
      return false;
    }

    if (filters.type.length && !filters.type.includes(territory.type)) {
      return false;
    }

    if (
      filters.categories.length &&
      !filters.categories.some((category) =>
        territory.categories.includes(category)
      )
    ) {
      return false;
    }

    if (!matchesCoverage(territory, filters.coverage)) return false;

    if (filters.cardLostOnly && !territory.cardLost) return false;

    if (filters.search.length) {
      const haystack =
        `${territory.number} ${territory.name} ${territory.city} ${territory.holder ?? ''} ${territory.categories.join(' ')}`.toLowerCase();

      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }

    return true;
  });

export const NO_RESTRICTIONS: TerritoryRestrictions = {
  categories: [],
  types: [],
};

// territories the congregation keeps out of the pool are never offered on their own;
// an elder still assigns them by hand, after speaking with the publisher
const isOffered = (territory: Territory, restricted: TerritoryRestrictions) =>
  !restricted.types.includes(territory.type) &&
  !territory.categories.some((category) =>
    restricted.categories.includes(category)
  );

const recommendedTerritories = (
  territories: Territory[],
  restricted: TerritoryRestrictions
) =>
  territories
    .filter(
      (territory) =>
        territory.status === 'available' &&
        !territory.requestedBy &&
        isOffered(territory, restricted)
    )
    .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered);

export const CURRENT_PUBLISHER = 'Mike Wallenter';

// read at render time to follow the app language
export const emptyListMessage = () =>
  getTranslation({ key: 'tr_noRecordsYet' });
export const NO_MATCHES = 'Nothing matches your search or filters.';

export const groupHolderName = (group: {
  name: string;
  sort_index: number;
}) => {
  const numbered = `Group ${group.sort_index + 1}`;

  return (
    GROUPS.find((label) => label.startsWith(`${numbered} `)) ||
    group.name ||
    numbered
  );
};

export const forTab = (
  territories: Territory[],
  tab: TerritoryTab,
  isEditor = true,
  groupHolder?: string,
  restricted: TerritoryRestrictions = NO_RESTRICTIONS
) => {
  if (tab === 'group') {
    return groupHolder
      ? territories.filter((territory) => territory.holder === groupHolder)
      : [];
  }

  if (tab === 'requests') {
    return territories.filter((territory) => territory.requestedBy);
  }

  if (tab === 'requested') {
    return territories.filter(
      (territory) => territory.requestedBy === CURRENT_PUBLISHER
    );
  }

  if (tab === 'recommended') {
    return recommendedTerritories(
      territories,
      isEditor ? NO_RESTRICTIONS : restricted
    );
  }

  if (tab === 'all' && !isEditor) {
    return territories.filter(
      (territory) =>
        territory.status === 'available' && isOffered(territory, restricted)
    );
  }

  if (tab === 'mine') {
    return territories.filter(
      (territory) => territory.holder === CURRENT_PUBLISHER
    );
  }

  return territories;
};

export const publisherLoad = (territories: Territory[]) => {
  const load = new Map<string, number>();

  for (const publisher of PUBLISHERS) load.set(publisher, 0);

  for (const territory of territories) {
    if (!territory.holder) continue;
    load.set(territory.holder, (load.get(territory.holder) ?? 0) + 1);
  }

  return [...load.entries()]
    .map(([publisher, count]) => ({ publisher, count }))
    .sort((a, b) => b.count - a.count);
};

export const suggestedPublisher = (territories: Territory[]) =>
  publisherLoad(territories).at(-1)?.publisher ?? PUBLISHERS[0];

export const coverageRate = (
  territories: Territory[],
  year = serviceYear()
) => {
  if (!territories.length) return 0;

  const { start, end } = serviceYearBounds(year);

  const covered = territories.filter((territory) =>
    returnedWithin(territory, start, end)
  ).length;

  return Math.round((covered / territories.length) * 100);
};

const DURATION_BANDS = [
  { label: '1-2 mo', max: 2 },
  { label: '3 mo', max: 3 },
  { label: '4 mo', max: 4 },
  { label: '5-6 mo', max: 6 },
  { label: '7-9 mo', max: 9 },
  { label: '10-12 mo', max: 12 },
  { label: '13-16 mo', max: 16 },
  { label: '17-24 mo', max: Infinity },
];

const allDurations = (territories: Territory[]) =>
  territories.flatMap((territory) =>
    territory.assignments
      .filter((assignment) => assignment.returnedOn)
      .map((assignment) => assignment.months)
  );

export const durationBuckets = (territories: Territory[]) => {
  const counts = DURATION_BANDS.map(() => 0);

  for (const months of allDurations(territories)) {
    const index = DURATION_BANDS.findIndex((band) => months <= band.max);

    counts[index] += 1;
  }

  return DURATION_BANDS.map((band, index) => ({
    label: band.label,
    value: counts[index],
  }));
};

export const medianDuration = (territories: Territory[]) => {
  const months = allDurations(territories).sort((a, b) => a - b);
  if (!months.length) return 0;

  const middle = Math.floor(months.length / 2);

  return months.length % 2
    ? months[middle]
    : Math.round(((months[middle - 1] + months[middle]) / 2) * 10) / 10;
};

export const averageDuration = (territories: Territory[]) => {
  const months = allDurations(territories);
  if (!months.length) return 0;

  return (
    Math.round(
      (months.reduce((acc, value) => acc + value, 0) / months.length) * 10
    ) / 10
  );
};

// month 0 is September of the year before the service year
const serviceMonthBounds = (year: number, month: number) => ({
  start: new Date(year - 1, 8 + month, 1),
  end: new Date(year - 1, 9 + month, 0, 23, 59, 59),
});

const heldWithin = (
  assignment: TerritoryAssignment,
  start: Date,
  end: Date
) => {
  const assigned = parseDate(assignment.assignedOn);
  if (!assigned || assigned > end) return false;

  const returned = parseDate(assignment.returnedOn) ?? new Date();

  return returned >= start;
};

export const inProgressPerMonth = (
  territories: Territory[],
  year = serviceYear()
) =>
  Array.from({ length: 12 }, (_, month) => {
    const { start, end } = serviceMonthBounds(year, month);

    return territories.filter((territory) =>
      territory.assignments.some((assignment) =>
        heldWithin(assignment, start, end)
      )
    ).length;
  });

export const completionCounts = (territories: Territory[]) => {
  const counts = [0, 0, 0, 0];

  for (const territory of territories) {
    const returned = territory.assignments.filter(
      (assignment) => assignment.returnedOn
    ).length;

    counts[Math.min(returned, 3)] += 1;
  }

  return [
    { label: 'Covered never', value: counts[0], color: 'var(--red-main)' },
    { label: 'Covered once', value: counts[1], color: 'var(--orange-main)' },
    { label: 'Covered twice', value: counts[2], color: 'var(--accent-main)' },
    {
      label: 'Covered 3 or more',
      value: counts[3],
      color: 'var(--green-main)',
    },
  ];
};

export const gapBuckets = (territories: Territory[]) => {
  const labels = ['0-2 mo', '3-5 mo', '6-8 mo', '9-11 mo', '12 mo+'];
  const counts = [0, 0, 0, 0, 0];

  for (const territory of territories) {
    const sorted = territory.assignments
      .map((assignment) => ({
        assigned: parseDate(assignment.assignedOn),
        returned: parseDate(assignment.returnedOn),
      }))
      .filter((entry) => entry.assigned)
      .sort((a, b) => a.assigned!.getTime() - b.assigned!.getTime());

    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1].returned;
      if (!previous) continue;

      const days =
        (sorted[index].assigned!.getTime() - previous.getTime()) / DAY;
      const gap = Math.max(0, Math.floor(days / 30.44));
      const bucket = Math.min(Math.floor(gap / 3), 4);
      counts[bucket] += 1;
    }
  }

  return labels.map((label, index) => ({ label, value: counts[index] }));
};

// dates are stored as dd.mm.yyyy
export const parseDate = (value?: string) => {
  if (!value) return null;

  const [day, month, year] = value.split('.').map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

export const toStoredDate = (date: Date) =>
  date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const serviceMonth = (date: Date) => (date.getMonth() + 4) % 12;

// derived from the dates, never typed in
export const assignmentFromDates = (
  base: TerritoryAssignment,
  publisher: string,
  assignedOn: Date,
  returnedOn: Date | null
) => {
  const end = returnedOn ?? assignedOn;

  const months =
    Math.max(
      0,
      (end.getFullYear() - assignedOn.getFullYear()) * 12 +
        end.getMonth() -
        assignedOn.getMonth()
    ) + 1;

  return {
    ...base,
    publisher,
    assignedOn: toStoredDate(assignedOn),
    returnedOn: returnedOn ? toStoredDate(returnedOn) : undefined,
    serviceYear: serviceYear(end),
    months,
    startMonth: serviceMonth(assignedOn),
    endMonth: serviceMonth(end),
  } as TerritoryAssignment;
};

export const coverageGrid = (territories: Territory[], years: number[]) =>
  years.map((year) => {
    const months = Array.from({ length: 12 }, () => 0);

    for (const territory of territories) {
      for (const assignment of territory.assignments) {
        if (assignment.serviceYear !== year || !assignment.returnedOn) continue;

        months[assignment.endMonth] += 1;
      }
    }

    return { year, months, total: months.reduce((acc, n) => acc + n, 0) };
  });

export const publisherCoverage = (territories: Territory[]) => {
  const load = publisherLoad(territories);

  const everHeld = new Set(
    territories.flatMap((territory) =>
      territory.assignments.map((assignment) => assignment.publisher)
    )
  );

  const idle = load.filter((entry) => entry.count === 0);

  const withTerritory = load.length - idle.length;
  const never = idle.filter((entry) => !everHeld.has(entry.publisher)).length;

  return { withTerritory, without: idle.length - never, never };
};

export const publishersPerMonth = (
  territories: Territory[],
  year = serviceYear()
) =>
  Array.from({ length: 12 }, (_, month) => {
    const { start, end } = serviceMonthBounds(year, month);
    const holders = new Set<string>();

    for (const territory of territories) {
      for (const assignment of territory.assignments) {
        if (heldWithin(assignment, start, end)) {
          holders.add(assignment.publisher);
        }
      }
    }

    return holders.size;
  });

// entries past two years are due for a re-check with the householder
export const doNotCallAges = (territories: Territory[], year: number) => {
  const { start, end } = serviceYearBounds(year);

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const dates = territories.flatMap((territory) =>
    territory.doNotCalls.map((entry) => parseDate(entry.date))
  );

  return {
    total: dates.length,
    old: dates.filter((date) => date && date < twoYearsAgo).length,
    added: dates.filter((date) => date && date >= start && date <= end).length,
  };
};

export const trimEmptyBands = <T extends { value: number }>(bands: T[]) => {
  const last = bands.reduce(
    (index, band, current) => (band.value > 0 ? current : index),
    -1
  );

  return last === -1 ? bands : bands.slice(0, last + 1);
};

export const appliedFilters = (filters: TerritoryFilters) =>
  filters.status.length +
  filters.type.length +
  filters.categories.length +
  (filters.coverage ? 1 : 0) +
  (filters.cardLostOnly ? 1 : 0);

// holder and status follow the open assignment, so a hand edit never leaves a stale holder
export const withAssignments = (
  territory: Territory,
  assignments: TerritoryAssignment[]
): Territory => {
  const time = (value?: string) => parseDate(value)?.getTime() ?? 0;
  const daysAgo = (value: number) =>
    Math.max(0, Math.round((Date.now() - value) / DAY));

  const lastReturned = Math.max(
    0,
    ...assignments.map((item) => time(item.returnedOn))
  );

  const daysSinceCovered = lastReturned
    ? daysAgo(lastReturned)
    : territory.daysSinceCovered;

  const open = assignments
    .filter((item) => !item.returnedOn)
    .sort((a, b) => time(b.assignedOn) - time(a.assignedOn))
    .at(0);

  if (!open) {
    return {
      ...territory,
      assignments,
      daysSinceCovered,
      status: 'available',
      holder: undefined,
      daysOut: undefined,
    };
  }

  return {
    ...territory,
    assignments,
    daysSinceCovered,
    status: territory.status === 'available' ? 'in_work' : territory.status,
    holder: open.publisher,
    daysOut: daysAgo(time(open.assignedOn) || Date.now()),
  };
};

// stored dates are dd.mm.yyyy; on screen they follow the congregation format
export const displayDate = (value: string | undefined, format: string) => {
  const date = parseDate(value);

  return date ? formatDate(date, format) : '';
};

export const upsertById = <T extends { id: string }>(list: T[], next: T) =>
  list.some((item) => item.id === next.id)
    ? list.map((item) => (item.id === next.id ? next : item))
    : [...list, next];

// numbers are compared by their digits, however they were typed
export const phoneDigits = (value: string) => value.replace(/\D/g, '');

export const isDoNotCallNumber = (territory: Territory, number: string) =>
  territory.doNotCalls.some(
    (entry) => phoneDigits(entry.address) === phoneDigits(number)
  );
