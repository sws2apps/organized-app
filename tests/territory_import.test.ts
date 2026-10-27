import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory } from '../src/definition/territory';
import {
  combineTerritoryImports,
  emptyTerritoryImport,
  importAssignment,
  importBoundary,
  importDate,
  prepareTerritoryImport,
  TerritoryImportError,
} from '../src/utils/territory_import';
import {
  parseTerritoryCSV,
  TERRITORY_CSV_TEMPLATE,
} from '../src/utils/territory_import_csv';
import { parseTerritoryJSON } from '../src/utils/territory_import_json';
import { parseTerritoryGeoJSON } from '../src/utils/territory_import_maps';

const people = [{ id: 'local-alice', name: 'Alice Example', group: false }];
const boundary = [
  [13, 52],
  [13.01, 52],
  [13.01, 52.01],
  [13, 52.01],
  [13, 52],
];
const territory = (): Territory => ({
  id: 'local-22',
  number: 'M22',
  name: 'Original',
  city: 'Berlin',
  type: 'door_to_door',
  categories: ['rural'],
  status: 'available',
  households: 120,
  daysSinceCovered: 100,
  cardLost: false,
  doNotCalls: [],
  assignments: [],
  notes: 'Keep this note',
  boundary: boundary as Territory['boundary'],
  mapMarkers: [{ id: 'marker', kind: 'pin', position: [13, 52] }],
});
const errorKey = (key: string) => (error: unknown) =>
  error instanceof TerritoryImportError && error.key === key;

test('downloaded template creates the documented territory without losing number prefixes', () => {
  const result = prepareTerritoryImport(
    combineTerritoryImports(
      [parseTerritoryCSV(TERRITORY_CSV_TEMPLATE, 'iso')],
      []
    ),
    [],
    []
  );
  assert.equal(result.added, 1);
  assert.equal(result.territories[0].number, 'M22');
  assert.equal(result.territories[0].households, 120);
});
test('CSV quoted multiline notes, semicolon delimiters, BOM and Unicode are preserved', () => {
  const result = parseTerritoryCSV(
    '\uFEFFNumber;Name;Notes\r\nM22;Straße;"First line\nSecond; line"',
    'iso'
  );
  assert.equal(result.entries[0].values.notes, 'First line\nSecond; line');
  assert.equal(result.entries[0].values.name, 'Straße');
});
test('CSV headers are case insensitive but duplicate headers and malformed quotes are rejected', () => {
  assert.equal(
    parseTerritoryCSV('NUMBER,Name\n01,Center', 'iso').entries[0].number,
    '01'
  );
  assert.throws(
    () => parseTerritoryCSV('Number,number\n1,2', 'iso'),
    errorKey('tr_territoryImportDuplicateColumn')
  );
  assert.throws(
    () => parseTerritoryCSV('Number,Name\n1,"Broken', 'iso'),
    errorKey('tr_territoryImportInvalidCSV')
  );
});
test('CSV empty and unknown formats do not look like successful imports', () => {
  assert.throws(
    () => parseTerritoryCSV('Number,Name\n', 'iso'),
    errorKey('tr_territoryImportEmpty')
  );
  assert.throws(
    () => parseTerritoryCSV('Person,Hours\nAlice,20', 'iso'),
    errorKey('tr_territoryImportNumberRequired')
  );
});
test('documented category code, suffix, notes and longitude-first boundaries are imported', () => {
  const raw = JSON.stringify(boundary).slice(1, -1).replaceAll('"', '""');
  const parsed = parseTerritoryCSV(
    `TerritoryID,CategoryCode,Number,Suffix,Area,Type,CustomNotes1,CustomNotes2,Boundary\n42,M,22,A,North,InPerson,First,Second,"${raw}"`,
    'iso'
  );
  assert.equal(parsed.entries[0].number, 'M22A');
  assert.equal(parsed.entries[0].values.notes, 'First\nSecond');
  assert.deepEqual(parsed.entries[0].values.boundary, boundary);
});
test('list and history files are joined by source ID regardless of selection order', () => {
  const list = parseTerritoryCSV(
    'TerritoryID,CategoryCode,Number,Area\n42,M,22,North',
    'iso'
  );
  const history = parseTerritoryCSV(
    'TerritoryID,DateAssigned,DateCompleted,Publisher\n42,2026-01-01,2026-02-01,Alice Example',
    'iso'
  );
  const result = prepareTerritoryImport(
    combineTerritoryImports([history, list], []),
    [],
    people
  );
  assert.equal(result.territories[0].assignments[0].returnedOn, '01.02.2026');
  assert.equal(result.territories[0].number, 'M22');
});
test('assignment-only imports match existing numbers but never guess external IDs', () => {
  const history = parseTerritoryCSV(
    'TerritoryNumber,DateAssigned,DateCompleted,Publisher\nM22,2026-01-01,2026-02-01,Alice Example',
    'iso'
  );
  const result = combineTerritoryImports([history], [territory()]);
  assert.equal(result.entries[0].number, 'M22');
  const idOnly = parseTerritoryCSV(
    'TerritoryID,DateAssigned,Publisher\n42,2026-01-01,Alice Example',
    'iso'
  );
  assert.throws(
    () => combineTerritoryImports([idOnly], [territory()]),
    errorKey('tr_territoryImportMissingTerritory')
  );
});
test('date parsing is explicit, rejects rollover dates and preserves calendar day in UTC timestamps', () => {
  assert.throws(
    () => importDate('01/02/2026', 'iso'),
    errorKey('tr_territoryImportDateError')
  );
  assert.equal(importDate('01/02/2026', 'day').getMonth(), 1);
  assert.equal(importDate('01/02/2026', 'month').getMonth(), 0);
  assert.equal(importDate('2026-01-01T00:00:00Z', 'iso').getDate(), 1);
  assert.throws(
    () => importDate('2026-02-30', 'iso'),
    errorKey('tr_territoryImportDateError')
  );
  assert.throws(
    () => importAssignment('Alice', '2026-03-01', '2026-02-01', '', 'iso'),
    errorKey('tr_territoryImportDateError')
  );
});
test('map-only imports preserve household counts, notes, categories, annotations and assignment history', () => {
  const original = territory();
  original.assignments = [
    importAssignment(
      'Alice Example',
      '2026-01-01',
      '2026-02-01',
      'Private',
      'iso'
    ),
  ];
  const maps = parseTerritoryGeoJSON({
    type: 'Feature',
    properties: { number: 'M22' },
    geometry: { type: 'Polygon', coordinates: [boundary] },
  });
  const result = prepareTerritoryImport(maps, [original], people)
    .territories[0];
  assert.equal(result.id, original.id);
  assert.equal(result.households, 120);
  assert.equal(result.notes, original.notes);
  assert.deepEqual(result.categories, original.categories);
  assert.deepEqual(result.mapMarkers, original.mapMarkers);
  assert.equal(result.assignments[0].note, 'Private');
});
test('reimport merges history idempotently and never reopens a completed assignment', () => {
  const history = parseTerritoryCSV(
    'Number,DateAssigned,Publisher\nM22,2026-01-01,Alice Example',
    'iso'
  );
  const data = combineTerritoryImports([history], [territory()]);
  const first = prepareTerritoryImport(data, [territory()], people).territories;
  const id = first[0].assignments[0].id;
  first[0].assignments[0].returnedOn = '01.02.2026';
  const again = prepareTerritoryImport(data, first, people).territories;
  assert.equal(again[0].assignments.length, 1);
  assert.equal(again[0].assignments[0].id, id);
  assert.equal(again[0].assignments[0].returnedOn, '01.02.2026');
});
test('explicit matching survives reimport and never uses the foreign publisher ID', () => {
  const data = emptyTerritoryImport();
  data.entries.push({
    number: 'M22',
    values: {
      assignments: [
        importAssignment('Example, Alice', '2026-01-01', '', '', 'iso'),
      ],
    },
  });
  const first = prepareTerritoryImport(data, [], people, {
    'Example, Alice': 'local-alice',
  });
  const again = prepareTerritoryImport(data, first.territories, people, {
    'Example, Alice': 'local-alice',
  });
  assert.equal(again.territories[0].assignments.length, 1);
  assert.equal(again.territories[0].holderId, 'local-alice');
});
test('unmatched or ambiguous active publishers require a manager match; historical names remain importable', () => {
  const data = emptyTerritoryImport();
  data.entries.push({
    number: 'M22',
    values: {
      assignments: [
        importAssignment('Alice Example', '2026-01-01', '', '', 'iso'),
      ],
    },
  });
  assert.deepEqual(prepareTerritoryImport(data, [], []).missing, [
    'Alice Example',
  ]);
  assert.deepEqual(
    prepareTerritoryImport(data, [], [...people, { ...people[0], id: 'other' }])
      .missing,
    ['Alice Example']
  );
  data.entries[0].values.assignments![0].returnedOn = '02.01.2026';
  assert.deepEqual(prepareTerritoryImport(data, [], []).missing, []);
});
test('conflicting active assignments and return dates block the import before any writes', () => {
  const original = territory();
  original.assignments = [
    importAssignment('Alice Example', '2026-01-01', '', '', 'iso'),
  ];
  const data = emptyTerritoryImport();
  data.entries.push({
    number: 'M22',
    values: {
      assignments: [importAssignment('Bob', '2026-01-02', '', '', 'iso')],
    },
  });
  assert.throws(
    () =>
      prepareTerritoryImport(
        data,
        [original],
        [...people, { id: 'bob', name: 'Bob', group: false }]
      ),
    errorKey('tr_territoryImportHistoryConflict')
  );
  assert.equal(original.assignments.length, 1);
});
test('standing notes append without duplication and oversized notes never truncate silently', () => {
  const data = parseTerritoryCSV('Number,Notes\nM22,New note', 'iso');
  const first = prepareTerritoryImport(data, [territory()], []).territories;
  assert.equal(first[0].notes, 'Keep this note\nNew note');
  assert.equal(
    prepareTerritoryImport(data, first, []).territories[0].notes,
    first[0].notes
  );
  assert.throws(
    () => parseTerritoryCSV(`Number,Notes\nM22,${'x'.repeat(501)}`, 'iso'),
    errorKey('tr_territoryImportLongNote')
  );
});
test('invalid topology and coordinates are rejected, closed simple rings are accepted', () => {
  assert.deepEqual(importBoundary(boundary), boundary);
  assert.throws(
    () =>
      importBoundary([
        [181, 0],
        [182, 0],
        [181, 1],
      ]),
    errorKey('tr_territoryImportInvalidBoundary')
  );
  assert.throws(
    () =>
      importBoundary([
        [0, 0],
        [1, 1],
        [0, 1],
        [1, 0],
      ]),
    errorKey('tr_territoryImportInvalidBoundary')
  );
});
test('complex maps are reported, never flattened into misleading outer boundaries', () => {
  assert.throws(
    () =>
      parseTerritoryGeoJSON({
        type: 'Feature',
        properties: { number: 'M22' },
        geometry: { type: 'Polygon', coordinates: [boundary, boundary] },
      }),
    errorKey('tr_territoryImportNoSupportedMaps')
  );
});
const jsonExport = () => ({
  publishers: [{ id: 999, firstname: 'Alice', lastname: 'Example' }],
  territories: [
    {
      id: 42,
      number: 'M22',
      locality: 'North',
      business: false,
      disabled: false,
      boundaries: JSON.stringify({
        type: 'MultiPolygon',
        coordinates: [[boundary]],
      }),
      addresses: [
        {
          id: 1,
          line1: '1 Example Street',
          dnc: true,
          location: { x: 13, y: 52, srid: 4326 },
        },
      ],
    },
  ],
  records: [
    {
      id: 1,
      territory_id: 42,
      user_id: 999,
      start: '2026-01-01',
      end: null,
      notes: 'Private assignment note',
    },
  ],
});
test('structured JSON imports maps, private history notes and do-not-calls without granting source identity', () => {
  const parsed = parseTerritoryJSON(JSON.stringify(jsonExport()));
  const prepared = prepareTerritoryImport(
    combineTerritoryImports([parsed], []),
    [],
    people
  );
  assert.equal(prepared.territories[0].holderId, 'local-alice');
  assert.equal(
    prepared.territories[0].assignments[0].note,
    'Private assignment note'
  );
  assert.equal(prepared.territories[0].notes, undefined);
  assert.equal(
    prepared.territories[0].doNotCalls[0].address,
    '1 Example Street'
  );
  assert.deepEqual(prepared.territories[0].boundary, boundary);
});
test('encrypted and malformed JSON are rejected before any data mutation', () => {
  assert.throws(
    () =>
      parseTerritoryJSON(
        JSON.stringify({
          ...jsonExport(),
          congregation: { e2ekey: 'ciphertext' },
        })
      ),
    errorKey('tr_territoryImportEncrypted')
  );
  assert.throws(
    () => parseTerritoryJSON('{'),
    errorKey('tr_territoryImportInvalidFile')
  );
  const missingPublisher = jsonExport();
  missingPublisher.publishers = [];
  assert.throws(
    () => parseTerritoryJSON(JSON.stringify(missingPublisher)),
    errorKey('tr_territoryImportMissingPublisher')
  );
});
test('addresses preserve do-not-call status and never add their phone to the callable list', () => {
  const csv = parseTerritoryCSV(
    'TerritoryNumber,Street,Number,Status,Phone\nM22,Example Street,1,DNC,+4912345\nM22,Other Street,2,Available,+4967890',
    'iso'
  );
  const data = combineTerritoryImports([csv], [territory()]);
  const first = prepareTerritoryImport(data, [territory()], []).territories;
  const again = prepareTerritoryImport(data, first, []).territories;
  assert.deepEqual(again[0].phoneNumbers, ['+4967890']);
  assert.equal(again[0].doNotCalls.length, 1);
  assert.ok(
    data.notices.some(
      (notice) => notice.key === 'tr_territoryImportAddressDetailsSkipped'
    )
  );
});
test('source ID disagreements and duplicate numbers block cross-file assignment corruption', () => {
  const list = parseTerritoryCSV(
    'TerritoryID,Number,Name\n42,M22,North',
    'iso'
  );
  const history = parseTerritoryCSV(
    'TerritoryID,Number,DateAssigned,Publisher\n42,M23,2026-01-01,Alice Example',
    'iso'
  );
  assert.throws(
    () => combineTerritoryImports([list, history], []),
    errorKey('tr_territoryImportDuplicate')
  );
  assert.throws(
    () => parseTerritoryCSV('Number,Name\nM22,North\nM22,South', 'iso'),
    errorKey('tr_territoryImportDuplicate')
  );
});

test('reimport of an active alias offers matching before checking holder conflicts', () => {
  const data = emptyTerritoryImport();
  data.entries.push({
    number: 'M22',
    values: {
      assignments: [
        importAssignment('Example, Alice', '2026-01-01', '', '', 'iso'),
      ],
    },
  });
  const initial = prepareTerritoryImport(data, [], people, {
    'Example, Alice': 'local-alice',
  });
  const preview = prepareTerritoryImport(data, initial.territories, people);
  assert.deepEqual(preview.missing, ['Example, Alice']);
  assert.equal(preview.territories[0].assignments.length, 1);
});
test('an open group record without a publisher does not block re-importing its territory', () => {
  const existing = {
    ...territory(),
    status: 'in_work',
    assignments: [
      {
        id: 'open',
        publisher: '',
        group: 'Group 1',
        assignedOn: '05.01.2026',
        serviceYear: '2025-2026',
        months: 1,
        startMonth: 4,
        endMonth: 4,
      },
    ],
  } as Territory;
  const result = prepareTerritoryImport(
    parseTerritoryCSV('Number,Name\nM22,Renamed', 'iso'),
    [existing],
    people
  );
  assert.deepEqual(result.missing, []);
  assert.equal(result.territories[0].name, 'Renamed');
});
