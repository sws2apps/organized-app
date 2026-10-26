import type { Territory } from '@definition/territory';
import {
  MAX_TERRITORY_IMPORT_BYTES,
  type TerritoryImportDateOrder,
} from '@definition/territory_import';
import { parseServiceTerritory } from '@features/territories/import/parse_service_territory';
import {
  combineTerritoryImports,
  emptyTerritoryImport,
  importError,
  importNotice,
} from '@utils/territory_import';
import { parseTerritoryCSV } from '@utils/territory_import_csv';
import { parseTerritoryJSON } from '@utils/territory_import_json';
import { parseTerritoryKML } from '@utils/territory_import_maps';

export const parseTerritoryFiles = async (
  files: Pick<File, 'size' | 'arrayBuffer'>[],
  existing: Territory[],
  dateOrder: TerritoryImportDateOrder
) => {
  if (
    !files.length ||
    files.reduce((size, file) => size + file.size, 0) >
      MAX_TERRITORY_IMPORT_BYTES
  )
    return importError('tr_territoryImportTooLarge');
  const datasets = [];
  // Read sequentially so multiple database backups do not allocate simultaneous WASM databases.
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (
      new TextDecoder().decode(bytes.subarray(0, 16)) === 'SQLite format 3\0'
    ) {
      const backup = await parseServiceTerritory(buffer);
      const data = emptyTerritoryImport();
      data.entries = backup.territories.map((territory) => ({
        number: territory.number,
        values: {
          name: territory.name,
          city: territory.city,
          type: territory.type,
          households: territory.households,
          cardLost: territory.cardLost,
          assignments: territory.assignments.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
          doNotCalls: territory.doNotCalls.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        },
      }));
      if (backup.driveMaps)
        importNotice(data, 'tr_territoryImportLinksSkipped');
      if (backup.skippedDisabled)
        importNotice(data, 'tr_territoryImportDisabledSkipped');
      datasets.push(data);
      continue;
    }
    let source: string;
    try {
      const encoding =
        bytes[0] === 255 && bytes[1] === 254
          ? 'utf-16le'
          : bytes[0] === 254 && bytes[1] === 255
            ? 'utf-16be'
            : 'utf-8';
      source = new TextDecoder(encoding, { fatal: true }).decode(buffer).trim();
    } catch {
      return importError('tr_territoryImportInvalidFile');
    }
    if (!source || source.includes('\0'))
      return importError('tr_territoryImportInvalidFile');
    datasets.push(
      source.startsWith('{')
        ? parseTerritoryJSON(source)
        : source.startsWith('<')
          ? parseTerritoryKML(source)
          : parseTerritoryCSV(source, dateOrder)
    );
  }
  return combineTerritoryImports(datasets, existing);
};
