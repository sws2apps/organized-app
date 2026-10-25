import {
  parseDate,
  assignmentFromDates,
  withAssignments,
} from '@utils/territory_dates';
export {
  parseDate,
  toStoredDate,
  assignmentFromDates,
  withAssignments,
} from '@utils/territory_dates';
import { formatDate } from '@utils/date';
import {
  formatElapsedDuration,
  getTranslation,
} from '@services/i18n/translation';
import {
  AssignmentIssue,
  ISSUE_TEXT,
  olderOpenAssignments,
} from '@features/territories/assignment_issues';
import {
  coveredDuration,
  isCoverage,
  returnedWithin,
} from '@features/territories/coverage_rate';
import { matchesHolder } from '@features/territories/holder_filter';
import {
  campaignOverdue,
  matchesCampaign,
} from '@features/territories/campaign_filter';
import { matchesCard } from '@features/territories/card_filter';
import { matchesText } from '@features/territories/text_search';
import {
  Territory,
  TerritoryAssignee,
  TerritoryAssignment,
  TerritoryCampaign,
  TerritoryFilters,
} from '@definition/territory';

export const EMPTY_FILTERS: TerritoryFilters = {
  search: '',
  status: [],
  type: [],
  categories: [],
  cardLostOnly: false,
  card: [],
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
    { id: 'last6', label: getTranslation({ key: 'tr_territoryLast6Months' }) },
    {
      id: 'last12',
      label: getTranslation({ key: 'tr_territoryLast12Months' }),
    },
    {
      id: `sy${current - 1}`,
      label: getTranslation({
        key: 'tr_territoryServiceYear',
        params: { year: current - 1 },
      }),
    },
    {
      id: `sy${current - 2}`,
      label: getTranslation({
        key: 'tr_territoryServiceYear',
        params: { year: current - 2 },
      }),
    },
  ];
};

const DAY = 86400000;

export const serviceYearBounds = (year: number) => ({
  start: new Date(year - 1, 8, 1),
  end: new Date(year, 7, 31, 23, 59, 59),
});

export type StatsRange = { start: Date; end: Date };

export const STATS_PERIODS = () => {
  const current = serviceYear();

  return [
    { id: 'last6', label: getTranslation({ key: 'tr_territoryLast6Months' }) },
    {
      id: 'last12',
      label: getTranslation({ key: 'tr_territoryLast12Months' }),
    },
    {
      id: `sy${current}`,
      label: getTranslation({
        key: 'tr_territoryServiceYearCurrent',
        params: { year: current },
      }),
    },
    {
      id: `sy${current - 1}`,
      label: getTranslation({
        key: 'tr_territoryServiceYear',
        params: { year: current - 1 },
      }),
    },
    { id: 'custom', label: getTranslation({ key: 'tr_custom' }) },
  ];
};

// the calendar months a range covers, the last 24 at most, for the charts
export const rangeMonths = ({ start, end }: StatsRange) => {
  const months: { year: number; month: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= end) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months.slice(-24);
};

export const chartsCut = ({ start, end }: StatsRange) =>
  (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth() >=
  24;

// last6 and last12 are calendar months: this month and the ones before it
export const periodWindow = (period: string) => {
  const now = new Date();

  if (period === 'last6' || period === 'last12') {
    const months = period === 'last6' ? 6 : 12;
    return {
      start: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
      end: now,
    };
  }

  const year = Number(period.replace('sy', ''));
  if (!year) return undefined;

  return serviceYearBounds(year);
};

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
  if (days < 31)
    return getTranslation({ key: 'tr_territoryD', params: { days } });

  const months = Math.round(days / 30);

  if (months < 12)
    return getTranslation({
      key: 'tr_territoryMonthsShort',
      params: { months },
    });

  const years = Math.floor(months / 12);
  const rest = months % 12;

  return rest === 0
    ? getTranslation({ key: 'tr_territoryY', params: { years } })
    : getTranslation({ key: 'tr_territoryYMo', params: { years, rest } });
};

// overdue is not stored: it follows from how long the territory has been out,
// or from the special campaign it was taken for being over
export const withDerivedStatus = (
  territories: Territory[],
  overdueMonths: number,
  campaigns: TerritoryCampaign[] = []
) =>
  territories.map((territory) => {
    if (territory.status === 'available') return territory;

    const overdue =
      (territory.daysOut ?? 0) > overdueMonths * 30 ||
      campaignOverdue(territory, campaigns);

    return {
      ...territory,
      status: overdue ? 'overdue' : 'in_work',
    } as Territory;
  });

const matchesCategories = (territory: Territory, categories: string[]) =>
  categories.length === 0 ||
  categories.some((category) => territory.categories.includes(category));

export const applyFilters = (
  territories: Territory[],
  filters: TerritoryFilters
) => {
  const cards = filters.card.filter((card) => card !== 'unknown');
  return territories.filter((territory) => {
    if (filters.status.length && !filters.status.includes(territory.status)) {
      return false;
    }

    if (filters.type.length && !filters.type.includes(territory.type)) {
      return false;
    }

    if (!matchesCategories(territory, filters.categories)) return false;

    if (!matchesCoverage(territory, filters.coverage)) return false;

    if (filters.cardLostOnly && !territory.cardLost) return false;

    if (filters.forGroups && !territory.holderGroup) return false;

    // 'unknown' was once a chip of its own; one left on from then is ignored
    if (!matchesCard(territory, cards)) return false;

    if (!matchesHolder(territory, filters.holder, filters.holderPast)) {
      return false;
    }

    if (!matchesCampaign(territory, filters.campaign)) return false;

    if (filters.search.length && !matchesText(territory, filters.search)) {
      return false;
    }

    return true;
  });
};

export { forTab, NO_RESTRICTIONS } from '@features/territories/tabs';

// Apple devices open Apple Maps, everything else Google Maps (the app, where installed)
export const openInMaps = (query: string) => {
  const q = encodeURIComponent(query);
  const url = /iPhone|iPad|Macintosh/.test(navigator.userAgent)
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;

  window.open(url, '_blank', 'noopener');
};

// the middle of the drawn border, so the maps app lands on the territory itself
export const territoryCenter = (territory: Territory) => {
  const ring = territory.boundary?.slice(0, -1) ?? [];
  if (ring.length === 0) return undefined;

  const lng = ring.reduce((sum, [x]) => sum + x, 0) / ring.length;
  const lat = ring.reduce((sum, [, y]) => sum + y, 0) / ring.length;

  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

// read at render time to follow the app language
export const emptyListMessage = () =>
  getTranslation({ key: 'tr_noRecordsYet' });
export const NO_MATCHES = 'tr_territoryNothingMatchesYourSearchOrFilters';

export const publisherLoad = (
  territories: Territory[],
  assignees: TerritoryAssignee[]
) => {
  const load = new Map<string, number>();

  for (const { name } of assignees) load.set(name, 0);

  // a group's territory counts for the group and for whoever took it
  for (const territory of territories) {
    for (const name of [territory.holder, territory.holderGroup]) {
      if (name) load.set(name, (load.get(name) ?? 0) + 1);
    }
  }

  return [...load.entries()]
    .map(([publisher, count]) => ({ publisher, count }))
    .sort((a, b) => b.count - a.count);
};

export { coverageRate } from '@features/territories/coverage_rate';

const DURATION_BANDS = [
  { label: 'tr_territory12Mo', max: 2 },
  { label: 'tr_territory3Mo', max: 3 },
  { label: 'tr_territory4Mo', max: 4 },
  { label: 'tr_territory56Mo', max: 6 },
  { label: 'tr_territory79Mo', max: 9 },
  { label: 'tr_territory1012Mo', max: 12 },
  { label: 'tr_territory1316Mo', max: 16 },
  { label: 'tr_territory1724Mo', max: Infinity },
];

const returnedIn = (assignment: TerritoryAssignment, range?: StatsRange) => {
  const returned = parseDate(assignment.returnedOn);
  if (!returned || !isCoverage(assignment)) return false;

  return !range || (returned >= range.start && returned <= range.end);
};

const allDurations = (territories: Territory[], range?: StatsRange) =>
  territories.flatMap((territory) =>
    territory.assignments
      .filter((assignment) => returnedIn(assignment, range))
      .map((assignment) => assignment.months)
  );

export const durationBuckets = (
  territories: Territory[],
  range?: StatsRange
) => {
  const counts = DURATION_BANDS.map(() => 0);

  for (const months of allDurations(territories, range)) {
    const index = DURATION_BANDS.findIndex((band) => months <= band.max);

    counts[index] += 1;
  }

  return DURATION_BANDS.map((band, index) => ({
    label: getTranslation({ key: band.label }),
    value: counts[index],
  }));
};

export const medianDuration = (
  territories: Territory[],
  range?: StatsRange
) => {
  const months = allDurations(territories, range).sort((a, b) => a - b);
  if (!months.length) return 0;

  const middle = Math.floor(months.length / 2);

  return months.length % 2
    ? months[middle]
    : Math.round(((months[middle - 1] + months[middle]) / 2) * 10) / 10;
};

export const averageDuration = (
  territories: Territory[],
  range?: StatsRange
) => {
  const months = allDurations(territories, range);
  if (!months.length) return 0;

  return (
    Math.round(
      (months.reduce((acc, value) => acc + value, 0) / months.length) * 10
    ) / 10
  );
};

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

const monthBounds = (year: number, month: number) => ({
  start: new Date(year, month, 1),
  end: new Date(year, month + 1, 0, 23, 59, 59),
});

export const inProgressPerMonth = (
  territories: Territory[],
  range: StatsRange
) =>
  rangeMonths(range).map(({ year, month }) => {
    const { start, end } = monthBounds(year, month);

    return territories.filter((territory) =>
      territory.assignments.some((assignment) =>
        heldWithin(assignment, start, end)
      )
    ).length;
  });

export const completionCounts = (
  territories: Territory[],
  range?: StatsRange
) => {
  const counts = [0, 0, 0, 0];

  for (const territory of territories) {
    const returned = territory.assignments.filter((assignment) =>
      returnedIn(assignment, range)
    ).length;

    counts[Math.min(returned, 3)] += 1;
  }

  return [
    {
      label: getTranslation({ key: 'tr_territoryCoveredNever' }),
      value: counts[0],
      color: 'var(--red-main)',
    },
    {
      label: getTranslation({ key: 'tr_territoryCoveredOnce' }),
      value: counts[1],
      color: 'var(--orange-main)',
    },
    {
      label: getTranslation({ key: 'tr_territoryCoveredTwice' }),
      value: counts[2],
      color: 'var(--accent-main)',
    },
    {
      label: getTranslation({ key: 'tr_territoryCovered3OrMore' }),
      value: counts[3],
      color: 'var(--green-main)',
    },
  ];
};

export const gapBuckets = (territories: Territory[], range?: StatsRange) => {
  const labels = [
    'tr_territory02Mo',
    'tr_territory35Mo',
    'tr_territory68Mo',
    'tr_territory911Mo',
    'tr_territoryTwelveMonthsOrMore',
  ];
  const counts = [0, 0, 0, 0, 0];

  for (const territory of territories) {
    const sorted = territory.assignments
      .filter(isCoverage)
      .map((assignment) => ({
        assigned: parseDate(assignment.assignedOn),
        returned: parseDate(assignment.returnedOn),
      }))
      .filter((entry) => entry.assigned)
      .sort((a, b) => a.assigned!.getTime() - b.assigned!.getTime());

    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1].returned;
      if (!previous) continue;
      const next = sorted[index].assigned!;
      if (range && (next < range.start || next > range.end)) continue;

      const days =
        (sorted[index].assigned!.getTime() - previous.getTime()) / DAY;
      const gap = Math.max(0, Math.floor(days / 30.44));
      const bucket = Math.min(Math.floor(gap / 3), 4);
      counts[bucket] += 1;
    }
  }

  return labels.map((label, index) => ({
    label: getTranslation({ key: label }),
    value: counts[index],
  }));
};

export {
  assignmentIssues,
  olderOpenAssignments,
} from '@features/territories/assignment_issues';

export const issuesText = (issues: AssignmentIssue[]) =>
  issues.map((issue) => getTranslation({ key: ISSUE_TEXT[issue] })).join(' · ');

// dates are stored as dd.mm.yyyy
export const coverageGrid = (territories: Territory[], years: number[]) =>
  years.map((year) => {
    const months = Array.from({ length: 12 }, () => 0);

    for (const territory of territories) {
      for (const assignment of territory.assignments) {
        if (
          assignment.serviceYear !== year ||
          !assignment.returnedOn ||
          !isCoverage(assignment)
        )
          continue;

        months[assignment.endMonth] += 1;
      }
    }

    return { year, months, total: months.reduce((acc, n) => acc + n, 0) };
  });

export const publisherCoverage = (
  territories: Territory[],
  assignees: TerritoryAssignee[]
) => {
  const load = publisherLoad(territories, assignees);

  const everHeld = new Set(
    territories.flatMap((territory) =>
      territory.assignments.flatMap((assignment) => [
        assignment.publisher,
        assignment.group ?? '',
      ])
    )
  );

  const idle = load.filter((entry) => entry.count === 0);

  return {
    withTerritory: load.filter((entry) => entry.count > 0),
    without: idle.filter((entry) => everHeld.has(entry.publisher)),
    never: idle.filter((entry) => !everHeld.has(entry.publisher)),
  };
};

export type PublisherSort = 'count' | 'name';

export const sortedPublishers = (
  entries: { publisher: string; count: number }[],
  sort: PublisherSort
) =>
  [...entries].sort((a, b) =>
    sort === 'name' || a.count === b.count
      ? a.publisher.localeCompare(b.publisher)
      : b.count - a.count
  );

export { coveredDays, coveredAge } from '@features/territories/coverage_rate';

export const coveredText = (territory: Territory) => {
  const duration = coveredDuration(territory);
  if (duration === null) return getTranslation({ key: 'tr_territoryNever' });

  return duration.months === 0 && duration.days === 0
    ? getTranslation({ key: 'tr_territoryToday' })
    : formatElapsedDuration(duration.months, duration.days);
};

// from the dates: the stored daysSinceCovered is a snapshot, 3650 after an import
export const waitingAge = (
  territory: Territory
): { kind: 'out' | 'waiting' | 'never'; days: number } => {
  const daysAgo = (time: number) =>
    Math.max(0, Math.round((Date.now() - time) / DAY));

  const open = territory.assignments.find((item) => !item.returnedOn);
  const assigned = parseDate(open?.assignedOn);

  if (open) {
    return { kind: 'out', days: assigned ? daysAgo(assigned.getTime()) : 0 };
  }

  const lastReturned = Math.max(
    0,
    ...territory.assignments
      .filter(isCoverage)
      .map((item) => parseDate(item.returnedOn)?.getTime() ?? 0)
  );

  if (lastReturned) return { kind: 'waiting', days: daysAgo(lastReturned) };

  return { kind: 'never', days: 0 };
};

export const publishersPerMonth = (
  territories: Territory[],
  range: StatsRange
) =>
  rangeMonths(range).map(({ year, month }) => {
    const { start, end } = monthBounds(year, month);
    const holders = new Set<string>();

    for (const territory of territories) {
      for (const assignment of territory.assignments) {
        if (assignment.publisher && heldWithin(assignment, start, end)) {
          holders.add(assignment.publisher);
        }
      }
    }

    return holders.size;
  });

// entries past two years are due for a re-check with the householder
export const doNotCallAges = (
  territories: Territory[],
  { start, end }: StatsRange
) => {
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
  (filters.cardLostOnly ? 1 : 0) +
  (filters.forGroups ? 1 : 0) +
  filters.card.filter((card) => card !== 'unknown').length +
  (filters.holder ? 1 : 0) +
  (filters.campaign ? 1 : 0);

// holder and status follow the open assignment, so a hand edit never leaves a stale holder
// the older of two open assignments ends on the day the newer one began
export const closeOlderAssignments = (territory: Territory) => {
  const older = new Set(olderOpenAssignments(territory.assignments));
  if (older.size === 0) return territory;

  const newest = territory.assignments.find(
    (item) => !item.returnedOn && !older.has(item)
  );
  const end = parseDate(newest?.assignedOn) ?? new Date();

  return withAssignments(
    territory,
    territory.assignments.map((item) =>
      older.has(item)
        ? assignmentFromDates(
            item,
            item.publisher,
            parseDate(item.assignedOn) ?? end,
            end
          )
        : item
    )
  );
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

// "label: count" reads the same in every language, with no plural forms
export const doNotCallLabel = (count: number, isPhone = false) =>
  isPhone
    ? getTranslation({
        key: 'tr_territoryDoNotCallNumbers',
        params: { n: count },
      })
    : getTranslation({
        key: 'tr_territoryDoNotCallAddresses',
        params: { n: count },
      });
