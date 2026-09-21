import { formatDate } from '@utils/date';
import { PUBLISHERS } from './mockData';
import {
  Territory,
  TerritoryAssignment,
  TerritoryFilters,
  TerritoryTab,
} from '@definition/territory';

export const EMPTY_FILTERS: TerritoryFilters = {
  search: '',
  status: [],
  type: [],
  categories: [],
  cardLostOnly: false,
};

// the service year runs from September to August
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

const periodWindow = (period: string) => {
  if (period === 'last6') return { from: 0, to: 182 };
  if (period === 'last12') return { from: 0, to: 365 };

  const year = Number(period.replace('sy', ''));
  if (!year) return undefined;

  const start = new Date(year - 1, 8, 1).getTime();
  const end = new Date(year, 7, 31).getTime();
  const day = 86400000;

  return {
    from: Math.max(0, Math.round((Date.now() - end) / day)),
    to: Math.round((Date.now() - start) / day),
  };
};

const matchesCoverage = (
  territory: Territory,
  coverage: TerritoryFilters['coverage']
) => {
  if (!coverage) return true;

  const window = periodWindow(coverage.period);
  if (!window) return true;

  const covered =
    territory.daysSinceCovered >= window.from &&
    territory.daysSinceCovered <= window.to;

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

export const dateFromDays = (days: number | undefined, format: string) => {
  if (days === undefined) return '–';

  return formatDate(new Date(Date.now() - days * 86400000), format);
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

const recommendedTerritories = (territories: Territory[]) =>
  territories
    .filter(
      (territory) => territory.status === 'available' && !territory.requestedBy
    )
    .sort((a, b) => b.daysSinceCovered - a.daysSinceCovered);

export const CURRENT_PUBLISHER = 'Mike Wallenter';

export const forTab = (territories: Territory[], tab: TerritoryTab) => {
  if (tab === 'requests') {
    return territories.filter((territory) => territory.requestedBy);
  }

  if (tab === 'recommended') return recommendedTerritories(territories);

  if (tab === 'mine') {
    return territories.filter(
      (territory) => territory.holder === CURRENT_PUBLISHER
    );
  }

  if (tab === 'overdue') {
    return territories
      .filter((territory) => territory.status === 'overdue')
      .sort((a, b) => (b.daysOut ?? 0) - (a.daysOut ?? 0));
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

export const coverageRate = (territories: Territory[]) => {
  if (!territories.length) return 0;

  const covered = territories.filter(
    (territory) => territory.daysSinceCovered < 365
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

export const durationBuckets = (territories: Territory[]) => {
  const counts = DURATION_BANDS.map(() => 0);

  for (const territory of territories) {
    for (const assignment of territory.assignments) {
      const index = DURATION_BANDS.findIndex(
        (band) => assignment.months <= band.max
      );

      counts[index] += 1;
    }
  }

  return DURATION_BANDS.map((band, index) => ({
    label: band.label,
    value: counts[index],
  }));
};

const allDurations = (territories: Territory[]) =>
  territories.flatMap((territory) =>
    territory.assignments.map((assignment) => assignment.months)
  );

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

export const inProgressPerMonth = (territories: Territory[]) =>
  Array.from(
    { length: 12 },
    (_, month) =>
      territories.filter((territory) =>
        territory.assignments.some(
          (assignment) =>
            assignment.startMonth <= month && assignment.endMonth >= month
        )
      ).length
  );

export const completionCounts = (territories: Territory[]) => {
  const counts = [0, 0, 0, 0];

  for (const territory of territories) {
    counts[Math.min(territory.assignments.length, 3)] += 1;
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
    const sorted = [...territory.assignments].sort(
      (a, b) => a.startMonth - b.startMonth
    );

    for (let index = 1; index < sorted.length; index += 1) {
      const gap = sorted[index].startMonth - sorted[index - 1].endMonth - 1;
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

const toStoredDate = (date: Date) =>
  date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

// month 0 of a service year is September
const serviceMonth = (date: Date) => (date.getMonth() + 4) % 12;

// the stored month indexes follow from the dates, so they are derived, never
// typed in
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

  const withTerritory = load.filter((entry) => entry.count > 0).length;

  return { withTerritory, without: load.length - withTerritory };
};

// how many publishers held something in each month of a service year
export const publishersPerMonth = (territories: Territory[], year: number) =>
  Array.from({ length: 12 }, (_, month) => {
    const holders = new Set<string>();

    for (const territory of territories) {
      for (const assignment of territory.assignments) {
        if (assignment.serviceYear !== year) continue;
        if (assignment.startMonth > month || assignment.endMonth < month) {
          continue;
        }

        holders.add(assignment.publisher);
      }
    }

    return holders.size;
  });

export const totalDoNotCalls = (territories: Territory[]) =>
  territories.reduce((acc, territory) => acc + territory.doNotCalls.length, 0);

export const reviewNeededCount = (territories: Territory[]) =>
  territories
    .flatMap((territory) => territory.doNotCalls)
    .filter((entry) => entry.reviewNeeded).length;

export const trimEmptyBands = <T extends { value: number }>(bands: T[]) => {
  const last = bands.reduce(
    (index, band, current) => (band.value > 0 ? current : index),
    -1
  );

  return last === -1 ? bands : bands.slice(0, last + 1);
};
