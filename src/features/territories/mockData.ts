import {
  DoNotCall,
  TerritoryBoundary,
  Territory,
  TerritoryAssignment,
  TerritoryCategory,
  TerritoryStatus,
  TerritoryType,
} from '@definition/territory';

export const GROUPS = ['Group 3 – Appeldorn', 'Group 5 – Kalkar'];

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
  'Marktstraße',
  'Gartenstraße',
  'Issumerstraße',
  'Geldernstraße',
  'Dickstraße',
  'Sonsbeckerstraße',
  'Pater-Delp-Straße',
  'Allerton Bridge',
  'Azalea Side',
  'Bankfield Walk',
  'Middlefield Grove',
  'Brussell Street',
  'Willowbrook Terrace',
  'Cedarwood Boulevard',
  'Moonbeam Circle',
  'Forest Glen Lane',
];

const CITIES = ['Appeldorn', 'Kalkar', 'Kleve', 'Goch', 'Emmerich'];

const PREFIXES = ['M', 'N', 'O', 'W'];

const CATEGORIES: TerritoryCategory[] = ['dangerous', 'dogs', 'gated'];

const DNC_NAMES = ['Mrs. Kramer', 'Mr. Vogel', 'Family Brinkmann', ''];

export const MAP_CENTER: [number, number] = [6.2925, 51.7385];

const BLOCK_WIDTH = 0.009;
const BLOCK_HEIGHT = 0.0055;
const COLUMNS = 8;

const buildBoundary = (
  index: number,
  random: () => number
): TerritoryBoundary | undefined => {
  if (random() > 0.82) return undefined;

  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);

  const left = MAP_CENTER[0] + (column - COLUMNS / 2) * BLOCK_WIDTH;
  const bottom = MAP_CENTER[1] + (row - 3) * BLOCK_HEIGHT;

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

// the area the congregation was assigned; it changes once every few years, so
// it is stored on its own instead of being derived from the territories
export const CONGREGATION_BOUNDARY: TerritoryBoundary = [
  [MAP_CENTER[0] - 0.052, MAP_CENTER[1] - 0.026],
  [MAP_CENTER[0] + 0.012, MAP_CENTER[1] - 0.031],
  [MAP_CENTER[0] + 0.055, MAP_CENTER[1] - 0.008],
  [MAP_CENTER[0] + 0.048, MAP_CENTER[1] + 0.022],
  [MAP_CENTER[0] - 0.014, MAP_CENTER[1] + 0.029],
  [MAP_CENTER[0] - 0.05, MAP_CENTER[1] + 0.012],
  [MAP_CENTER[0] - 0.052, MAP_CENTER[1] - 0.026],
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

const monthDate = (
  random: () => number,
  serviceYear: number,
  month: number
) => {
  const calendarMonth = ((month + 8) % 12) + 1;
  const calendarYear = month < 4 ? serviceYear - 1 : serviceYear;

  return `${String(1 + Math.floor(random() * 28)).padStart(2, '0')}.${String(
    calendarMonth
  ).padStart(2, '0')}.${calendarYear}`;
};

const buildTerritory = (index: number, random: () => number): Territory => {
  const prefix = PREFIXES[index % PREFIXES.length];
  const number = `${prefix}${Math.floor(index / PREFIXES.length) + 1}`;

  const typeRoll = random();
  const type: TerritoryType =
    typeRoll > 0.88 ? 'phone' : typeRoll > 0.7 ? 'business' : 'door_to_door';

  const statusRoll = random();
  const status: TerritoryStatus =
    statusRoll > 0.78 ? 'overdue' : statusRoll > 0.44 ? 'in_work' : 'available';

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

  const daysSinceCovered = Math.round(
    COVERAGE_MONTHS[index % COVERAGE_MONTHS.length] * 30.4 + random() * 20 - 10
  );

  // a territory is worked over several months, across past service years
  const assignments: TerritoryAssignment[] = [];

  for (const serviceYear of [2024, 2025, 2026]) {
    if (random() > 0.72) continue;

    const startMonth = Math.floor(random() * 8);
    const months = 2 + Math.floor(random() * 5);
    const endMonth = Math.min(11, startMonth + months - 1);

    assignments.push({
      id: `as-${index}-${serviceYear}`,
      publisher: PUBLISHERS[Math.floor(random() * PUBLISHERS.length)],
      assignedOn: monthDate(random, serviceYear, startMonth),
      returnedOn: monthDate(random, serviceYear, endMonth),
      serviceYear,
      months: endMonth - startMonth + 1,
      startMonth,
      endMonth,
    });
  }

  const categories = CATEGORIES.filter(() => random() > 0.85);

  const doNotCalls: DoNotCall[] = Array.from(
    { length: Math.floor(random() * 6) },
    (_, entryIndex) => {
      const year = 2019 + Math.floor(random() * 7);

      return {
        id: `dnc-${index}-${entryIndex}`,
        address: `${STREETS[Math.floor(random() * STREETS.length)]} ${
          1 + Math.floor(random() * 240)
        }`,
        name: DNC_NAMES[Math.floor(random() * DNC_NAMES.length)] || undefined,
        date: formatDate(random, year),
        addedBy: PUBLISHERS[Math.floor(random() * PUBLISHERS.length)],
        reviewNeeded: year < 2024,
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
    requestedBy:
      status === 'available' && random() > 0.88
        ? PUBLISHERS[Math.floor(random() * PUBLISHERS.length)]
        : undefined,
    reviewNeeded: status === 'available' && random() > 0.9,
  };
};

const buildTerritories = (count: number): Territory[] => {
  const random = rng(20260920);

  return Array.from({ length: count }, (_, index) =>
    buildTerritory(index, random)
  );
};

export const TERRITORIES = buildTerritories(48);
