import { MAX_NOTE_LENGTH } from '@definition/territory';
import { MAX_TERRITORY_IMPORT_ROWS } from '@definition/territory_import';
import {
  emptyTerritoryImport,
  importAssignment,
  importError,
  importNotice,
  importObject,
  importText,
} from '@utils/territory_import';
import {
  importGeometry,
  parseTerritoryGeoJSON,
} from '@utils/territory_import_maps';

// Only territory data is read; congregation credentials, privileges, and other records are ignored.
export const parseTerritoryJSON = (source: string) => {
  let root: Record<string, unknown>;
  try {
    root = importObject(JSON.parse(source));
  } catch {
    return importError('tr_territoryImportInvalidFile');
  }
  if (root.type === 'FeatureCollection' || root.type === 'Feature')
    return parseTerritoryGeoJSON(root);
  if (root.congregation && importObject(root.congregation).e2ekey)
    return importError('tr_territoryImportEncrypted');
  const container = Array.isArray(root.territories)
    ? root
    : importObject(root.territories);
  if (!Array.isArray(container.territories))
    return importError('tr_territoryImportInvalidFile');
  if (container.territories.length > MAX_TERRITORY_IMPORT_ROWS)
    return importError('tr_territoryImportTooLarge');
  const data = emptyTerritoryImport();
  const people = new Map<string, string>();
  for (const list of [root.publishers, root.notPublishers]) {
    if (list !== undefined && !Array.isArray(list))
      return importError('tr_territoryImportInvalidFile');
    for (const value of list ?? []) {
      const person = importObject(value);
      const id = importText(person.id);
      if (!id || people.has(id))
        return importError('tr_territoryImportInvalidFile');
      people.set(
        id,
        [importText(person.firstname), importText(person.lastname)]
          .filter(Boolean)
          .join(' ')
      );
    }
  }
  const disabled = new Set<string>();
  const ids = new Set<string>();
  for (const value of container.territories) {
    const territory = importObject(value);
    const id = importText(territory.id);
    if (!id || ids.has(id))
      return importError('tr_territoryImportDuplicate', id);
    ids.add(id);
    if (
      territory.disabled !== undefined &&
      typeof territory.disabled !== 'boolean'
    )
      return importError('tr_territoryImportInvalidFile');
    if (territory.disabled === true) {
      disabled.add(id);
      importNotice(data, 'tr_territoryImportDisabledSkipped');
      continue;
    }
    const number = importText(territory.number);
    if (!number) return importError('tr_territoryImportNumberRequired');
    const notes = importText(territory.notes);
    if (notes.length > MAX_NOTE_LENGTH)
      return importError('tr_territoryImportLongNote', number);
    const values: (typeof data.entries)[number]['values'] = {};
    if (importText(territory.locality))
      values.name = importText(territory.locality);
    if (territory.business !== undefined) {
      if (typeof territory.business !== 'boolean')
        return importError('tr_territoryImportInvalidType', number);
      values.type = territory.business ? 'business' : 'door_to_door';
    }
    if (notes) values.notes = notes;
    if (territory.boundaries) {
      let geometry: unknown;
      try {
        geometry =
          typeof territory.boundaries === 'string'
            ? JSON.parse(territory.boundaries)
            : territory.boundaries;
      } catch {
        return importError('tr_territoryImportInvalidBoundary', number);
      }
      const boundary = importGeometry(geometry, data);
      if (boundary) values.boundary = boundary;
    }
    if (territory.annotations)
      importNotice(data, 'tr_territoryImportAnnotationsSkipped');
    if (territory.url) importNotice(data, 'tr_territoryImportLinksSkipped');
    if (Array.isArray(territory.tags) && territory.tags.length)
      importNotice(data, 'tr_territoryImportCategoriesSkipped');
    if (Array.isArray(territory.children) && territory.children.length)
      return importError('tr_territoryImportSectionsUnsupported', number);
    if (
      territory.addresses !== undefined &&
      !Array.isArray(territory.addresses)
    )
      return importError('tr_territoryImportInvalidFile');
    for (const raw of territory.addresses ?? []) {
      const address = importObject(raw);
      const text = ['line1', 'line2', 'city', 'state', 'postalcode']
        .map((field) => importText(address[field]))
        .filter(Boolean)
        .join(', ');
      if (address.dnc === true) {
        if (!text) return importError('tr_territoryImportInvalidAddress');
        let position: [number, number] | undefined;
        if (address.location) {
          const location = importObject(address.location);
          if (
            typeof location.x !== 'number' ||
            typeof location.y !== 'number' ||
            !Number.isFinite(location.x) ||
            !Number.isFinite(location.y) ||
            Math.abs(location.x) > 180 ||
            Math.abs(location.y) > 90 ||
            (location.srid !== undefined && location.srid !== 4326)
          )
            return importError('tr_territoryImportInvalidAddress');
          position = [location.x, location.y];
        }
        values.doNotCalls = [
          ...(values.doNotCalls ?? []),
          {
            id: crypto.randomUUID(),
            address: text,
            name: importText(address.name),
            date: '',
            addedBy: '',
            ...(position ? { position } : {}),
          },
        ];
      } else if (importText(address.phone))
        values.phoneNumbers = [
          ...(values.phoneNumbers ?? []),
          importText(address.phone),
        ];
      if (
        address.dnc !== true ||
        address.notes ||
        address.visits ||
        address.lang
      )
        importNotice(data, 'tr_territoryImportAddressDetailsSkipped');
    }
    data.entries.push({ number, sourceId: `json:${id}`, values });
  }
  const records = container.records ?? root.territoryRecords;
  if (records !== undefined && !Array.isArray(records))
    return importError('tr_territoryImportInvalidFile');
  if (Array.isArray(records) && records.length > MAX_TERRITORY_IMPORT_ROWS)
    return importError('tr_territoryImportTooLarge');
  for (const value of records ?? []) {
    const record = importObject(value);
    const territoryId = importText(record.territory_id);
    if (disabled.has(territoryId)) continue;
    if (!ids.has(territoryId))
      return importError('tr_territoryImportMissingTerritory', territoryId);
    const publisher = people.get(importText(record.user_id));
    if (!publisher) return importError('tr_territoryImportMissingPublisher');
    data.assignments.push({
      reference: { sourceId: `json:${territoryId}`, number: '' },
      value: importAssignment(
        publisher,
        importText(record.start),
        importText(record.end),
        importText(record.notes),
        'iso'
      ),
    });
    if (Array.isArray(record.tags) && record.tags.length)
      importNotice(data, 'tr_territoryImportCategoriesSkipped');
  }
  return data;
};
