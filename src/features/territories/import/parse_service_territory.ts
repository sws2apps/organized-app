import type { Database, SqlValue } from 'sql.js';
import {
  DoNotCall,
  Territory,
  TerritoryAssignment,
  TerritoryType,
} from '@definition/territory';
import { assignmentFromDates, toStoredDate, withAssignments } from '../helpers';

export type ServiceTerritoryImport = {
  territories: Territory[];
  assignments: number;
  doNotCalls: number;
  publishers: number;
  skippedDisabled: number;
  driveMaps: number;
};

type Row = Record<string, SqlValue>;

const rows = (db: Database, sql: string): Row[] => {
  const result = db.exec(sql).at(0);
  if (!result) return [];

  return result.values.map((values) =>
    Object.fromEntries(result.columns.map((column, i) => [column, values[i]]))
  );
};

const text = (value: SqlValue) =>
  typeof value === 'string' ? value.trim() : '';

// the app is written in Java, so its months count from 0
const dateOf = (day: SqlValue, month: SqlValue, year: SqlValue) => {
  if (typeof day !== 'number' || typeof month !== 'number') return null;
  if (typeof year !== 'number' || year < 1900) return null;

  return new Date(year, month, day);
};

const typeFromName = (name: string): TerritoryType => {
  const value = name.toLowerCase();

  if (/phone|telefon|téléphone|telefone/.test(value)) return 'phone';
  if (/business|geschäft|gewerbe|comercial|commerce/.test(value)) {
    return 'business';
  }

  return 'door_to_door';
};

const loadDatabase = async (buffer: ArrayBuffer) => {
  const [{ default: initSqlJs }, { default: wasmUrl }] = await Promise.all([
    import('sql.js'),
    import('sql.js/dist/sql-wasm.wasm?url'),
  ]);

  const SQL = await initSqlJs({ locateFile: () => wasmUrl });

  return new SQL.Database(new Uint8Array(buffer));
};

export const parseServiceTerritory = async (
  buffer: ArrayBuffer
): Promise<ServiceTerritoryImport> => {
  let db: Database;

  try {
    db = await loadDatabase(buffer);
    db.exec('SELECT count(*) FROM territories');
  } catch {
    throw new Error('This file is not a Service Territory backup.');
  }

  try {
    const types = new Map(
      rows(db, 'SELECT _id, Name FROM territories_types').map((row) => [
        row._id,
        typeFromName(text(row.Name)),
      ])
    );

    const publishers = new Map(
      rows(db, 'SELECT _id, FirstName, LastName FROM publishers').map((row) => [
        row._id,
        `${text(row.FirstName)} ${text(row.LastName)}`.trim(),
      ])
    );

    const assignmentRows = rows(
      db,
      'SELECT * FROM assignments ORDER BY YearIni, MonthIni, DayIni, _id'
    );

    const doNotCallRows = rows(db, 'SELECT * FROM visit_not');

    const driveMaps = rows(
      db,
      "SELECT count(*) AS count FROM maps WHERE coalesce(MapId, '') <> ''"
    ).at(0)?.count as number;

    let assignments = 0;
    let doNotCalls = 0;
    let skippedDisabled = 0;

    const territories = rows(db, 'SELECT * FROM territories')
      .filter((row) => {
        if (row.Disabled === 1) skippedDisabled += 1;
        return row.Disabled !== 1;
      })
      .map((row) => {
        const id = `st-${row._id}`;

        const history = assignmentRows
          .filter((item) => item.idTerritory === row._id)
          .map((item) => ({
            item,
            start: dateOf(item.DayIni, item.MonthIni, item.YearIni),
            end: dateOf(item.DayEnd, item.MonthEnd, item.YearEnd),
          }))
          .filter((entry) => entry.start);

        // only the newest hand-out can still be open; an older open one ended when it went out again
        const records: TerritoryAssignment[] = history.map((entry, index) => {
          const next = history[index + 1]?.start ?? null;

          return assignmentFromDates(
            {
              id: `${id}-a${entry.item._id}`,
              publisher: '',
              assignedOn: '',
              serviceYear: 0,
              months: 0,
              startMonth: 0,
              endMonth: 0,
            },
            publishers.get(entry.item.idPublisher) ?? '',
            entry.start!,
            entry.end ?? next
          );
        });

        assignments += records.length;

        const dncs: DoNotCall[] = doNotCallRows
          .filter((item) => item.idTerritory === row._id)
          .map((item) => {
            const date = dateOf(item.Day, item.Month, item.Year);
            const city = text(item.City);

            return {
              id: `${id}-d${item._id}`,
              address: [text(item.Street), city === text(row.City) ? '' : city]
                .filter(Boolean)
                .join(', '),
              date: date ? toStoredDate(date) : '',
              addedBy: publishers.get(item.idPublisher) ?? '',
            };
          });

        doNotCalls += dncs.length;

        const territory: Territory = {
          id,
          number: text(row.Number),
          name: text(row.Description) || text(row.City),
          city: text(row.City),
          type: types.get(row.idGroup) ?? 'door_to_door',
          status: 'available',
          categories: [],
          daysSinceCovered: 0,
          households: typeof row.Doors === 'number' ? row.Doors : 0,
          cardLost: row.Lost === 1,
          doNotCalls: dncs,
          assignments: [],
        };

        const imported = withAssignments(territory, records);

        // never returned: rank it with the longest-unworked territories
        return records.some((record) => record.returnedOn)
          ? imported
          : { ...imported, daysSinceCovered: 3650 };
      })
      .sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true })
      );

    return {
      territories,
      assignments,
      doNotCalls,
      publishers: publishers.size,
      skippedDisabled,
      driveMaps: driveMaps ?? 0,
    };
  } finally {
    db.close();
  }
};
