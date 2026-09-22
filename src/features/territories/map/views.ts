import {
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TYPE_LABEL,
} from '@definition/territory';
import {
  daysLabel,
  parseDate,
  serviceYear,
  serviceYearBounds,
} from '../helpers';

export type ColorView = 'status' | 'lastCovered' | 'heatmap' | 'type';

export const HEATMAP_YEARS = () =>
  [1, 2, 3].map((back) => serviceYear() - back);

export const COLOR_VIEWS = [
  {
    id: 'status' as ColorView,
    label: 'Status',
  },
  {
    id: 'lastCovered' as ColorView,
    label: 'Last covered',
  },
  {
    id: 'heatmap' as ColorView,
    label: 'Heatmap',
  },
  {
    id: 'type' as ColorView,
    label: 'Type',
  },
];

type Bucket = { key: string; label: string; color: string };

const DAY = 86400000;

const RECENCY: Bucket[] = [
  { key: 'h0', label: 'Under 3 months', color: '--green-main' },
  { key: 'h1', label: '3 to 6 months', color: '--orange-main' },
  { key: 'h2', label: '6 to 12 months', color: '--orange-dark' },
  { key: 'h3', label: 'Over a year', color: '--red-main' },
  { key: 'never', label: 'Never covered', color: '--grey-350' },
];

const FREQUENCY: Bucket[] = [
  { key: 'f0', label: 'Not worked', color: '--accent-300' },
  { key: 'f1', label: 'Once', color: '--green-main' },
  { key: 'f2', label: 'Twice', color: '--orange-main' },
  { key: 'f3', label: '3 times', color: '--orange-dark' },
  { key: 'f4', label: '4 times or more', color: '--red-main' },
];

const TYPES: Bucket[] = [
  { key: 'door_to_door', label: 'Door to door', color: '--accent-main' },
  { key: 'business', label: 'Business', color: '--orange-main' },
];

const returns = (territory: Territory) =>
  territory.assignments
    .map((assignment) => parseDate(assignment.returnedOn)?.getTime())
    .filter((time): time is number => !!time);

const recencyKey = (territory: Territory) => {
  const last = Math.max(0, ...returns(territory));
  if (!last) return 'never';

  const days = (Date.now() - last) / DAY;

  if (days < 91) return 'h0';
  if (days < 182) return 'h1';
  if (days < 365) return 'h2';
  return 'h3';
};

const timesWorked = (territory: Territory, year: number) => {
  const { start, end } = serviceYearBounds(year);

  return returns(territory).filter(
    (time) => time >= start.getTime() && time <= end.getTime()
  ).length;
};

const lastCoveredText = (territory: Territory) => {
  const last = Math.max(0, ...returns(territory));
  if (!last) return 'Never';

  return daysLabel(Math.round((Date.now() - last) / DAY));
};

export const colorScheme = (view: ColorView, year = HEATMAP_YEARS()[0]) => {
  if (view === 'lastCovered') {
    return {
      buckets: RECENCY,
      keyOf: recencyKey,
      detailOf: lastCoveredText,
    };
  }

  if (view === 'heatmap') {
    return {
      buckets: FREQUENCY,
      keyOf: (territory: Territory) =>
        `f${Math.min(timesWorked(territory, year), 4)}`,
      detailOf: (territory: Territory) => `${timesWorked(territory, year)}×`,
    };
  }

  if (view === 'type') {
    return {
      buckets: TYPES,
      keyOf: (territory: Territory) => territory.type,
      detailOf: (territory: Territory) => TYPE_LABEL[territory.type],
    };
  }

  return {
    buckets: (['available', 'in_work', 'overdue'] as const).map((status) => ({
      key: status,
      label: STATUS_LABEL[status],
      color: `--${STATUS_COLOR[status]}-main`,
    })),
    keyOf: (territory: Territory) => territory.status as string,
    detailOf: (territory: Territory) => STATUS_LABEL[territory.status],
  };
};
