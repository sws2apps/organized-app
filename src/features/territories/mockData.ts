import {
  DoNotCall,
  TerritoryBoundary,
  Territory,
  TerritoryAssignment,
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

const CATEGORIES: string[] = ['dangerous', 'dogs', 'gated', 'rural'];

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

const IDLE = new Set([16, 57, 92, 120]);

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

const pickType = (roll: number): TerritoryType => {
  if (roll > 0.88) return 'phone';
  if (roll > 0.7) return 'business';
  return 'door_to_door';
};

const pickStatus = (idle: boolean, roll: number): TerritoryStatus => {
  if (idle) return 'available';
  if (roll > 0.78) return 'overdue';
  if (roll > 0.44) return 'in_work';
  return 'available';
};

const pickPace = (pace: number) => {
  if (pace > 0.7) return [1, 2, 0, 1];
  if (pace > 0.25) return [2, 4, 1, 4];
  return [3, 6, 6, 12];
};

const pickPublisher = (random: () => number) =>
  PUBLISHERS[Math.floor(random() * PUBLISHERS.length)];

const serviceYearOf = (date: Date) =>
  date.getMonth() >= 8 ? date.getFullYear() + 1 : date.getFullYear();

const buildPastAssignments = (index: number, random: () => number) => {
  const assignments: TerritoryAssignment[] = [];

  const [minMonths, maxMonths, minGap, maxGap] = pickPace(random());

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
      publisher: pickPublisher(random),
      assignedOn: storedDate(start),
      returnedOn: storedDate(end),
      serviceYear: serviceYearOf(end),
      months: Math.max(1, Math.round(duration / (30.4 * DAY_MS))),
      startMonth: (start.getMonth() + 4) % 12,
      endMonth: (end.getMonth() + 4) % 12,
    });

    cursor =
      returned +
      (minGap + random() * (maxGap - minGap)) * 30.4 * DAY_MS +
      3 * DAY_MS;
  }

  return assignments;
};

const withOpenAssignment = (
  index: number,
  past: TerritoryAssignment[],
  holder: string,
  daysOut: number
): TerritoryAssignment[] => {
  const started = new Date(Date.now() - daysOut * 86400000);

  const before = past.filter((assignment) => {
    const [day, month, year] = assignment.returnedOn!.split('.').map(Number);

    return new Date(year, month - 1, day) < started;
  });

  return [
    ...before,
    {
      id: `a-${index}-open`,
      publisher: holder,
      assignedOn: started.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      serviceYear: serviceYearOf(started),
      months: Math.max(1, Math.round(daysOut / 30)),
      startMonth: (started.getMonth() + 4) % 12,
      endMonth: (new Date().getMonth() + 4) % 12,
    },
  ];
};

const buildPhoneNumbers = (random: () => number) =>
  Array.from(
    { length: 8 + Math.floor(random() * 20) },
    () =>
      `(${200 + Math.floor(random() * 700)}) 555-${String(
        Math.floor(random() * 10000)
      ).padStart(4, '0')}`
  );

const buildDoNotCalls = (
  index: number,
  random: () => number,
  phoneNumbers?: string[]
): DoNotCall[] =>
  Array.from({ length: Math.floor(random() * 6) }, (_, entryIndex) => {
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
      addedBy: pickPublisher(random),
    };
  });

const buildTerritory = (index: number, random: () => number): Territory => {
  const number = String(index + 1);

  const type = pickType(random());

  const idle = IDLE.has(index);

  const status = pickStatus(idle, random());

  const cardLost = random() > 0.93;

  const assigned = status === 'in_work' || status === 'overdue';
  const holder = assigned ? pickPublisher(random) : undefined;

  let daysOut: number | undefined;
  if (assigned) {
    daysOut =
      status === 'overdue'
        ? 190 + Math.floor(random() * 200)
        : 5 + Math.floor(random() * 140);
  }

  const coveredGuess = idle
    ? 820 + index
    : Math.round(
        COVERAGE_MONTHS[index % COVERAGE_MONTHS.length] * 30.4 +
          random() * 20 -
          10
      );

  let assignments = idle ? [] : buildPastAssignments(index, random);

  if (holder && daysOut !== undefined) {
    assignments = withOpenAssignment(index, assignments, holder, daysOut);
  }

  // covered means returned as completed, so a territory out for a year still counts from its last return
  const lastReturn = Math.max(
    0,
    ...assignments.map((item) => {
      const [day, month, year] = (item.returnedOn ?? '').split('.').map(Number);
      return item.returnedOn ? new Date(year, month - 1, day).getTime() : 0;
    })
  );
  const daysSinceCovered = lastReturn
    ? Math.round((Date.now() - lastReturn) / DAY_MS)
    : coveredGuess;

  const phoneNumbers = type === 'phone' ? buildPhoneNumbers(random) : undefined;

  const categories = CATEGORIES.filter(() => random() > 0.85);

  const doNotCalls = buildDoNotCalls(index, random, phoneNumbers);

  const streetA = STREETS[Math.floor(random() * STREETS.length)];
  const streetB = STREETS[Math.floor(random() * STREETS.length)];

  const available = status === 'available';

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
      available && random() > 0.88 ? pickPublisher(random) : undefined,
    reviewNeeded: available && random() > 0.9,
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
