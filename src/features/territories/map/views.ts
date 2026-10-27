import {
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TYPE_LABEL,
} from '@definition/territory';
import { getTranslation } from '@services/i18n/translation';
import {
  daysLabel,
  parseDate,
  periodWindow,
  serviceYear,
} from '@features/territories/helpers';

export type ColorView =
  | 'status'
  | 'lastCovered'
  | 'heatmap'
  | 'type'
  | 'original';

export const HEATMAP_PERIODS = () => [
  { id: 'last6', label: getTranslation({ key: 'tr_territoryLast6Months' }) },
  { id: 'last12', label: getTranslation({ key: 'tr_territoryLast12Months' }) },
  ...[1, 2, 3].map((back) => ({
    id: `sy${serviceYear() - back}`,
    label: getTranslation({
      key: 'tr_territoryServiceYear',
      params: { year: serviceYear() - back },
    }),
  })),
];

export const COLOR_VIEWS = [
  {
    id: 'status' as ColorView,
    label: 'tr_territoryStatus',
    description: 'tr_territoryAvailableInWorkOrOverdue',
  },
  {
    id: 'lastCovered' as ColorView,
    label: 'tr_territoryLastCovered',
    description: 'tr_territoryHowLongAgoItWasLastWorked',
  },
  {
    id: 'heatmap' as ColorView,
    label: 'tr_territoryHeatmap',
    description: 'tr_territoryHowOftenItWasWorkedInAChosenPeriod',
  },
  {
    id: 'type' as ColorView,
    label: 'tr_type',
    description: 'tr_territoryDoorToDoorOrBusiness',
  },
  {
    id: 'original' as ColorView,
    label: 'tr_territoryOwnColors',
    description: 'tr_territoryTheColorsPickedForEachTerritory',
  },
];

export type Bucket = { key: string; label: string; color: string };

const DAY = 86400000;

const RECENCY: Bucket[] = [
  { key: 'h0', label: 'tr_territoryUnder3Months', color: '--green-main' },
  { key: 'h1', label: 'tr_territory3To6Months', color: '--orange-main' },
  { key: 'h2', label: 'tr_territory6To12Months', color: '--orange-dark' },
  { key: 'h3', label: 'tr_territoryOverAYear', color: '--red-main' },
  { key: 'never', label: 'tr_noRecordsYet', color: '--grey-350' },
];

const FREQUENCY: Bucket[] = [
  { key: 'f0', label: 'tr_territoryNotWorked', color: '--accent-300' },
  { key: 'f1', label: 'tr_territoryOnce', color: '--green-main' },
  { key: 'f2', label: 'tr_territoryTwice', color: '--orange-main' },
  { key: 'f3', label: 'tr_territory3Times', color: '--orange-dark' },
  { key: 'f4', label: 'tr_territory4TimesOrMore', color: '--red-main' },
];

const TYPES: Bucket[] = [
  {
    key: 'door_to_door',
    label: 'tr_territoryTypeDoorToDoor',
    color: '--accent-main',
  },
  {
    key: 'business',
    label: 'tr_territoryTypeBusiness',
    color: '--orange-main',
  },
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

const timesWorked = (territory: Territory, period: string) => {
  const window = periodWindow(period);
  if (!window) return 0;
  const { start, end } = window;

  return returns(territory).filter(
    (time) => time >= start.getTime() && time <= end.getTime()
  ).length;
};

const lastCoveredText = (territory: Territory) => {
  const last = Math.max(0, ...returns(territory));
  if (!last) return getTranslation({ key: 'tr_territoryNever' });

  return daysLabel(Math.round((Date.now() - last) / DAY));
};

export const colorScheme = (
  view: ColorView,
  period = 'last12',
  translate: (key: string) => string = (key) => getTranslation({ key })
) => {
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
        `f${Math.min(timesWorked(territory, period), 4)}`,
      detailOf: (territory: Territory) => `${timesWorked(territory, period)}×`,
    };
  }

  if (view === 'original') {
    return {
      buckets: [] as Bucket[],
      keyOf: () => '',
      detailOf: () => '',
    };
  }

  if (view === 'type') {
    return {
      buckets: TYPES,
      keyOf: (territory: Territory) => territory.type,
      detailOf: (territory: Territory) => translate(TYPE_LABEL[territory.type]),
    };
  }

  return {
    buckets: (['available', 'in_work', 'overdue'] as const).map((status) => ({
      key: status,
      label: STATUS_LABEL[status],
      color: `--${STATUS_COLOR[status]}-main`,
    })),
    keyOf: (territory: Territory) => territory.status as string,
    detailOf: (territory: Territory) =>
      translate(STATUS_LABEL[territory.status]),
  };
};
