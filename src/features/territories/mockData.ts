import {
  DoNotCall,
  TerritoryBoundary,
  Territory,
  TerritoryAssignment,
  TerritoryCategory,
  TerritoryStatus,
  TerritoryType,
} from '@definition/territory';

export const GROUPS = ['Group 3 – Kreuzberg', 'Group 5 – Neukölln'];

export const PUBLISHERS_ONLY = [
  'Mike Wallenter',
  'George Markus',
  'Sandero Schneidertson',
  'Anna Weber',
  'Kvas Taras',
  'Julia Brandt',
  'Peter Novak',
];

export const PUBLISHERS = [...GROUPS, ...PUBLISHERS_ONLY];

const STREETS = [
  'Oranienstraße',
  'Bergmannstraße',
  'Graefestraße',
  'Wiener Straße',
  'Sonnenallee',
  'Weserstraße',
  'Hermannstraße',
  'Karl-Marx-Straße',
  'Boxhagener Straße',
  'Simon-Dach-Straße',
  'Kastanienallee',
  'Schönhauser Allee',
  'Torstraße',
  'Invalidenstraße',
  'Goltzstraße',
  'Akazienstraße',
];

const CITIES = [
  'Kreuzberg',
  'Neukölln',
  'Friedrichshain',
  'Prenzlauer Berg',
  'Mitte',
  'Schöneberg',
];

const CATEGORIES: TerritoryCategory[] = ['dangerous', 'dogs', 'gated', 'rural'];

const DNC_NAMES = ['Mrs. Kramer', 'Mr. Vogel', 'Family Brinkmann', ''];

export const MAP_CENTER: [number, number] = [13.4105, 52.5005];

const BLOCK_WIDTH = 0.009;
const BLOCK_HEIGHT = 0.0055;
const COLUMNS = 12;
const ROWS = 11;

const buildBoundary = (
  index: number,
  random: () => number
): TerritoryBoundary | undefined => {
  if (random() > 0.82) return undefined;

  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);

  const left = MAP_CENTER[0] + (column - COLUMNS / 2) * BLOCK_WIDTH;
  const bottom = MAP_CENTER[1] + (row - ROWS / 2) * BLOCK_HEIGHT;

  const jitter = () => (random() - 0.5) * 0.0012;

  const corners: TerritoryBoundary = [
    [left + jitter(), bottom + jitter()],
    [left + BLOCK_WIDTH + jitter(), bottom + jitter()],
    [left + BLOCK_WIDTH + jitter(), bottom + BLOCK_HEIGHT + jitter()],
    [left + jitter(), bottom + BLOCK_HEIGHT + jitter()],
  ];

  return [...corners, corners[0]];
};

const COVERAGE_MONTHS = [1, 3, 5, 8, 10, 13, 15, 20, 26];

const DAY_MS = 86400000;

const HISTORY_START = new Date(2024, 8, 1).getTime();

const IDLE = [16, 57, 92, 120];

const storedDate = (date: Date) =>
  date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

// the area the congregation was assigned; it changes once every few years, so
// it is stored on its own instead of being derived from the territories
export const CONGREGATION_BOUNDARY: TerritoryBoundary = [
  [MAP_CENTER[0] - 0.066, MAP_CENTER[1] - 0.034],
  [MAP_CENTER[0] + 0.008, MAP_CENTER[1] - 0.041],
  [MAP_CENTER[0] + 0.068, MAP_CENTER[1] - 0.02],
  [MAP_CENTER[0] + 0.064, MAP_CENTER[1] + 0.034],
  [MAP_CENTER[0] - 0.01, MAP_CENTER[1] + 0.041],
  [MAP_CENTER[0] - 0.064, MAP_CENTER[1] + 0.022],
  [MAP_CENTER[0] - 0.066, MAP_CENTER[1] - 0.034],
];

const rng = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
};

const formatDate = (random: () => number, year: number) =>
  `${String(1 + Math.floor(random() * 28)).padStart(2, '0')}.${String(
    1 + Math.floor(random() * 12)
  ).padStart(2, '0')}.${year}`;

const buildTerritory = (index: number, random: () => number): Territory => {
  const number = String(index + 1);

  const typeRoll = random();
  const type: TerritoryType =
    typeRoll > 0.88 ? 'phone' : typeRoll > 0.7 ? 'business' : 'door_to_door';

  const idle = IDLE.includes(index);

  const statusRoll = random();
  const status: TerritoryStatus = idle
    ? 'available'
    : statusRoll > 0.78
      ? 'overdue'
      : statusRoll > 0.44
        ? 'in_work'
        : 'available';

  const cardLost = random() > 0.93;

  const assigned = status === 'in_work' || status === 'overdue';
  const holder = assigned
    ? PUBLISHERS[Math.floor(random() * PUBLISHERS.length)]
    : undefined;

  const daysOut = assigned
    ? status === 'overdue'
      ? 190 + Math.floor(random() * 200)
      : 5 + Math.floor(random() * 140)
    : undefined;

  const daysSinceCovered = idle
    ? 820 + index
    : Math.round(
        COVERAGE_MONTHS[index % COVERAGE_MONTHS.length] * 30.4 +
          random() * 20 -
          10
      );

  let assignments: TerritoryAssignment[] = [];

  if (!idle) {
    const pace = random();
    const [minMonths, maxMonths, minGap, maxGap] =
      pace > 0.7 ? [1, 2, 0, 1] : pace > 0.25 ? [2, 4, 1, 4] : [3, 6, 6, 12];

    const now = Date.now();
    let cursor = HISTORY_START + random() * 60 * DAY_MS;

    while (true) {
      const duration =
        (minMonths + random() * (maxMonths - minMonths)) * 30.4 * DAY_MS;
      const returned = cursor + duration;

      if (returned >= now - 7 * DAY_MS) break;

      const start = new Date(cursor);
      const end = new Date(returned);

      assignments.push({
        id: `as-${index}-${assignments.length}`,
        publisher: PUBLISHERS[Math.floor(random() * PUBLISHERS.length)],
        assignedOn: storedDate(start),
        returnedOn: storedDate(end),
        serviceYear:
          end.getMonth() >= 8 ? end.getFullYear() + 1 : end.getFullYear(),
        months: Math.max(1, Math.round(duration / (30.4 * DAY_MS))),
        startMonth: (start.getMonth() + 4) % 12,
        endMonth: (end.getMonth() + 4) % 12,
      });

      cursor =
        returned +
        (minGap + random() * (maxGap - minGap)) * 30.4 * DAY_MS +
        3 * DAY_MS;
    }
  }

  if (holder && daysOut !== undefined) {
    const started = new Date(Date.now() - daysOut * 86400000);

    assignments = assignments.filter((assignment) => {
      const [day, month, year] = assignment.returnedOn!.split('.').map(Number);

      return new Date(year, month - 1, day) < started;
    });

    assignments.push({
      id: `a-${index}-open`,
      publisher: holder,
      assignedOn: started.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      serviceYear:
        started.getMonth() >= 8
          ? started.getFullYear() + 1
          : started.getFullYear(),
      months: Math.max(1, Math.round(daysOut / 30)),
      startMonth: (started.getMonth() + 4) % 12,
      endMonth: (new Date().getMonth() + 4) % 12,
    });
  }

  const phoneNumbers =
    type === 'phone'
      ? Array.from(
          { length: 8 + Math.floor(random() * 20) },
          () =>
            `(${200 + Math.floor(random() * 700)}) 555-${String(
              Math.floor(random() * 10000)
            ).padStart(4, '0')}`
        )
      : undefined;

  const categories = CATEGORIES.filter(() => random() > 0.85);

  const doNotCalls: DoNotCall[] = Array.from(
    { length: Math.floor(random() * 6) },
    (_, entryIndex) => {
      const year = 2019 + Math.floor(random() * 7);

      const address = `${STREETS[Math.floor(random() * STREETS.length)]} ${
        1 + Math.floor(random() * 240)
      }`;
      const name =
        DNC_NAMES[Math.floor(random() * DNC_NAMES.length)] || undefined;

      // a phone territory's do-not-calls are some of its own numbers
      const step = phoneNumbers ? Math.floor(phoneNumbers.length / 5) : 0;

      return {
        id: `dnc-${index}-${entryIndex}`,
        address: phoneNumbers ? phoneNumbers[entryIndex * step] : address,
        name: phoneNumbers ? undefined : name,
        date: formatDate(random, year),
        addedBy: PUBLISHERS[Math.floor(random() * PUBLISHERS.length)],
      };
    }
  );

  const streetA = STREETS[Math.floor(random() * STREETS.length)];
  const streetB = STREETS[Math.floor(random() * STREETS.length)];

  return {
    id: `t${index}`,
    number,
    name: streetA === streetB ? streetA : `${streetA}, ${streetB}`,
    city: CITIES[Math.floor(random() * CITIES.length)],
    type,
    status,
    categories,
    holder,
    daysOut,
    daysSinceCovered,
    households: 25 + Math.floor(random() * 300),
    cardLost,
    doNotCalls,
    assignments,
    boundary: buildBoundary(index, random),
    phoneNumbers,
    requestedBy:
      status === 'available' && random() > 0.88
        ? PUBLISHERS[Math.floor(random() * PUBLISHERS.length)]
        : undefined,
    reviewNeeded: status === 'available' && random() > 0.9,
  };
};

const buildTerritories = (count: number): Territory[] => {
  const random = rng(20260920);

  const territories = Array.from({ length: count }, (_, index) =>
    buildTerritory(index, random)
  );

  const request = territories.find((territory) => territory.requestedBy);
  if (request) request.requestedBy = 'Mike Wallenter';

  return territories;
};

export const TERRITORIES = buildTerritories(132);
