import type {
  Territory,
  TerritoryAssignee,
  TerritoryAssignment,
  TerritoryBoundary,
} from '@definition/territory';
import { MAX_NOTE_LENGTH } from '@definition/territory';
import type {
  TerritoryImportData,
  TerritoryImportDateOrder,
  TerritoryImportEntry,
  TerritoryImportNotice,
} from '@definition/territory_import';
import { MAX_TERRITORY_IMPORT_POINTS } from '@definition/territory_import';
import { territoryNumberKey } from '@utils/territory';
import { assignmentFromDates, withAssignments } from '@utils/territory_dates';
import { normalizeTerritoryBoundary } from '@utils/territory_geometry';

export class TerritoryImportError extends Error {
  constructor(
    public key: string,
    public values?: Record<string, string | number>
  ) {
    super(key);
  }
}
export const importError = (key: string, detail = ''): never => {
  throw new TerritoryImportError(key, { detail });
};
export const importText = (value: unknown) =>
  typeof value === 'string'
    ? value.trim()
    : typeof value === 'number' && Number.isFinite(value)
      ? String(value)
      : '';
export const importObject = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return importError('tr_territoryImportInvalidFile');
  return value as Record<string, unknown>;
};
export const importDate = (value: string, order: TerritoryImportDateOrder) => {
  let parts: number[];
  if (/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/.test(value)) {
    parts = value.slice(0, 10).split('-').map(Number);
  } else if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(value)) {
    parts = value.split('.').map(Number).reverse();
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value) && order !== 'iso') {
    const [first, second, year] = value.split('/').map(Number);
    parts = [
      year,
      order === 'day' ? second : first,
      order === 'day' ? first : second,
    ];
  } else return importError('tr_territoryImportDateError', value);
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  if (
    year < 1900 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return importError('tr_territoryImportDateError', value);
  return date;
};
export const importAssignment = (
  publisher: string,
  start: string,
  end: string,
  note: string,
  order: TerritoryImportDateOrder
) => {
  if (!publisher) return importError('tr_territoryImportMissingPublisher');
  const assigned = importDate(start, order);
  const returned = end ? importDate(end, order) : null;
  if (returned && returned < assigned)
    return importError('tr_territoryImportDateError', `${start} – ${end}`);
  if (note.length > MAX_NOTE_LENGTH)
    return importError('tr_territoryImportLongNote', publisher);
  return assignmentFromDates(
    {
      id: crypto.randomUUID(),
      publisher,
      assignedOn: '',
      serviceYear: 0,
      months: 0,
      startMonth: 0,
      endMonth: 0,
      ...(note ? { note } : {}),
    },
    publisher,
    assigned,
    returned
  );
};
export const importBoundary = (value: unknown): TerritoryBoundary => {
  if (
    !Array.isArray(value) ||
    value.length < 3 ||
    value.length > MAX_TERRITORY_IMPORT_POINTS
  )
    return importError('tr_territoryImportInvalidBoundary');
  const ring: TerritoryBoundary = value.map((point) => {
    if (
      !Array.isArray(point) ||
      point.length < 2 ||
      !point.every(
        (coordinate) =>
          typeof coordinate === 'number' && Number.isFinite(coordinate)
      )
    )
      return importError('tr_territoryImportInvalidBoundary');
    return [point[0], point[1]];
  });
  // Reuse the editor's topology and coordinate checks, including self-intersections.
  try {
    const checked = normalizeTerritoryBoundary(ring);
    if (checked) return checked;
  } catch {
    /* Invalid topology is reported alongside other import errors. */
  }
  return importError('tr_territoryImportInvalidBoundary');
};
export const emptyTerritoryImport = (): TerritoryImportData => ({
  entries: [],
  assignments: [],
  addresses: [],
  notices: [],
});
export const importNotice = (
  data: TerritoryImportData,
  key: string,
  detail = ''
) => {
  if (
    !data.notices.some(
      (notice) => notice.key === key && notice.values?.detail === detail
    )
  )
    data.notices.push({ key, values: { detail } });
};

const nameKey = (value: string) =>
  value.trim().normalize('NFKC').toLocaleLowerCase();
const historyKey = (value: TerritoryAssignment) =>
  JSON.stringify([
    value.publisherId ?? nameKey(value.publisher),
    value.assignedOn,
    value.groupId ?? value.group ?? '',
    value.campaign?.id ?? '',
  ]);
const mergeHistory = (
  existing: TerritoryAssignment[],
  incoming: TerritoryAssignment[]
) => {
  const result = new Map(existing.map((item) => [historyKey(item), item]));
  for (const item of incoming) {
    const key = historyKey(item);
    const prior = result.get(key);
    if (!prior) result.set(key, item);
    else {
      if (
        prior.returnedOn &&
        item.returnedOn &&
        prior.returnedOn !== item.returnedOn
      )
        return importError('tr_territoryImportHistoryConflict', item.publisher);
      if (prior.note && item.note && prior.note !== item.note)
        return importError('tr_territoryImportHistoryConflict', item.publisher);
      result.set(key, {
        ...item,
        ...prior,
        returnedOn: prior.returnedOn || item.returnedOn,
        note: prior.note || item.note,
      });
    }
  }
  const records = [...result.values()]
    .map((record) =>
      assignmentFromDates(
        record,
        record.publisher,
        importDate(record.assignedOn, 'iso'),
        record.returnedOn ? importDate(record.returnedOn, 'iso') : null
      )
    )
    .sort(
      (a, b) =>
        importDate(a.assignedOn, 'iso').getTime() -
        importDate(b.assignedOn, 'iso').getTime()
    );
  if (records.filter((record) => !record.returnedOn).length > 1)
    return importError(
      'tr_territoryImportHistoryConflict',
      records.at(-1)?.publisher
    );
  return records;
};

export const combineTerritoryImports = (
  datasets: TerritoryImportData[],
  existing: Territory[]
): TerritoryImportData => {
  const result = emptyTerritoryImport();
  const entries = new Map<string, TerritoryImportEntry>();
  const sourceNumbers = new Map<string, string>();
  for (const data of datasets) {
    for (const entry of data.entries) {
      const key = territoryNumberKey(entry.number);
      if (!key) return importError('tr_territoryImportNumberRequired');
      if (entry.sourceId) {
        const number = sourceNumbers.get(entry.sourceId);
        if (number && number !== key)
          return importError('tr_territoryImportDuplicate', entry.number);
        sourceNumbers.set(entry.sourceId, key);
      }
      const previous = entries.get(key);
      if (previous) {
        const left = previous.values;
        const right = entry.values;
        for (const field of Object.keys(right) as (keyof typeof right)[]) {
          if (
            left[field] !== undefined &&
            JSON.stringify(left[field]) !== JSON.stringify(right[field])
          )
            return importError('tr_territoryImportDuplicate', entry.number);
        }
        previous.values = { ...left, ...right };
      } else entries.set(key, structuredClone(entry));
    }
    result.notices.push(...data.notices);
  }
  const referenceEntry = (reference: { number: string; sourceId?: string }) => {
    const fromId = reference.sourceId
      ? sourceNumbers.get(reference.sourceId)
      : undefined;
    const fromNumber = territoryNumberKey(reference.number);
    if (fromId && fromNumber && fromId !== fromNumber)
      return importError('tr_territoryImportDuplicate', reference.number);
    const key = fromId || fromNumber;
    if (!key)
      return importError(
        'tr_territoryImportMissingTerritory',
        reference.sourceId
      );
    let entry = entries.get(key);
    if (!entry) {
      const matches = existing.filter(
        (territory) => territoryNumberKey(territory.number) === key
      );
      if (matches.length !== 1)
        return importError(
          'tr_territoryImportMissingTerritory',
          reference.number
        );
      entry = { number: matches[0].number, values: {} };
      entries.set(key, entry);
    }
    return entry;
  };
  for (const data of datasets) {
    for (const assignment of data.assignments) {
      const entry = referenceEntry(assignment.reference);
      entry.values.assignments = mergeHistory(entry.values.assignments ?? [], [
        assignment.value,
      ]);
    }
    for (const address of data.addresses) {
      const entry = referenceEntry(address.reference);
      entry.values.doNotCalls = [
        ...(entry.values.doNotCalls ?? []),
        ...(address.values.doNotCalls ?? []),
      ];
      entry.values.phoneNumbers = [
        ...(entry.values.phoneNumbers ?? []),
        ...(address.values.phoneNumbers ?? []),
      ];
    }
  }
  result.entries = [...entries.values()];
  if (!result.entries.length) return importError('tr_territoryImportEmpty');
  return result;
};

export const prepareTerritoryImport = (
  data: TerritoryImportData,
  existing: Territory[],
  assignees: TerritoryAssignee[],
  matches: Record<string, string> = {}
) => {
  const current = new Map<string, Territory>();
  for (const territory of existing) {
    const key = territoryNumberKey(territory.number);
    if (current.has(key))
      return importError('tr_territoryImportDuplicate', territory.number);
    current.set(key, territory);
  }
  const missing = new Set<string>();
  const notices: TerritoryImportNotice[] = [...data.notices];
  let added = 0;
  let updated = 0;
  let assignmentCount = 0;
  let doNotCalls = 0;
  let boundaries = 0;
  for (const entry of data.entries) {
    const key = territoryNumberKey(entry.number);
    const previous = current.get(key);
    const values = { ...entry.values };
    // Existing standing notes may contain information added after the export.
    if (previous?.notes && values.notes && previous.notes !== values.notes) {
      const combined = `${previous.notes}\n${values.notes}`;
      if (
        !previous.notes.includes(values.notes) &&
        combined.length > MAX_NOTE_LENGTH
      )
        return importError('tr_territoryImportLongNote', entry.number);
      values.notes = previous.notes.includes(values.notes)
        ? previous.notes
        : combined;
    }
    const resolvePublisher = (record: TerritoryAssignment) => {
      if (record.publisherId) return record;
      const candidates = assignees.filter(
        (person) =>
          !person.group &&
          (matches[record.publisher]
            ? person.id === matches[record.publisher]
            : nameKey(person.name) === nameKey(record.publisher))
      );
      if (candidates.length !== 1) return record;
      return {
        ...record,
        publisher: record.returnedOn ? record.publisher : candidates[0].name,
        publisherId: candidates[0].id,
      };
    };
    const priorHistory = (previous?.assignments ?? []).map(resolvePublisher);
    const importedHistory = (values.assignments ?? []).map(resolvePublisher);
    const unresolved = [...priorHistory, ...importedHistory].filter(
      (record) => !record.returnedOn && !record.publisherId
    );
    for (const record of unresolved) missing.add(record.publisher);
    // Let managers resolve aliases before treating them as two different active holders.
    const assignments = unresolved.length
      ? priorHistory
      : mergeHistory(priorHistory, importedHistory);
    assignmentCount += values.assignments?.length ?? 0;
    doNotCalls += values.doNotCalls?.length ?? 0;
    boundaries += values.boundary ? 1 : 0;
    const dnc = new Map(
      (previous?.doNotCalls ?? []).map((item) => [nameKey(item.address), item])
    );
    for (const item of values.doNotCalls ?? []) {
      const prior = dnc.get(nameKey(item.address));
      dnc.set(nameKey(item.address), prior ? { ...item, ...prior } : item);
    }
    const territory: Territory = {
      id: crypto.randomUUID(),
      number: entry.number,
      name: '',
      city: '',
      type: 'door_to_door',
      categories: [],
      households: 0,
      status: 'available',
      daysSinceCovered: 3650,
      cardLost: false,
      ...previous,
      ...values,
      assignments,
      doNotCalls: [...dnc.values()],
      phoneNumbers: [
        ...new Set([
          ...(previous?.phoneNumbers ?? []),
          ...(values.phoneNumbers ?? []),
        ]),
      ],
    };
    current.set(key, withAssignments(territory, assignments));
    if (previous) updated++;
    else added++;
  }
  return {
    territories: [...current.values()],
    missing: [...missing],
    notices,
    added,
    updated,
    assignments: assignmentCount,
    doNotCalls,
    boundaries,
    sample: data.entries.slice(0, 10).map((entry) => ({
      number: entry.number,
      name: current.get(territoryNumberKey(entry.number))?.name ?? '',
    })),
    remaining: Math.max(0, data.entries.length - 10),
  };
};
