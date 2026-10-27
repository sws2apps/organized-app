import type { TerritoryImportData } from '@definition/territory_import';
import {
  emptyTerritoryImport,
  importBoundary,
  importError,
  importNotice,
  importObject,
  importText,
} from '@utils/territory_import';

export const importGeometry = (value: unknown, data: TerritoryImportData) => {
  const geometry = importObject(value);
  let rings: unknown;
  if (geometry.type === 'Polygon') rings = geometry.coordinates;
  else if (
    geometry.type === 'MultiPolygon' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.length === 1
  )
    rings = geometry.coordinates[0];
  else {
    importNotice(data, 'tr_territoryImportComplexBoundary');
    return;
  }
  if (!Array.isArray(rings) || rings.length !== 1) {
    importNotice(data, 'tr_territoryImportComplexBoundary');
    return;
  }
  return importBoundary(rings[0]);
};
export const parseTerritoryGeoJSON = (value: unknown) => {
  const root = importObject(value);
  let features: unknown;
  if (root.type === 'FeatureCollection') features = root.features;
  else if (root.type === 'Feature') features = [root];
  if (!Array.isArray(features))
    return importError('tr_territoryImportInvalidFile');
  const data = emptyTerritoryImport();
  for (const value of features) {
    const feature = importObject(value);
    const geometry = importObject(feature.geometry);
    if (!['Polygon', 'MultiPolygon'].includes(importText(geometry.type))) {
      importNotice(data, 'tr_territoryImportAnnotationsSkipped');
      continue;
    }
    const properties = importObject(feature.properties ?? {});
    const number =
      importText(properties.number) ||
      importText(properties.Number) ||
      importText(properties.name);
    if (!number) return importError('tr_territoryImportNumberRequired');
    const boundary = importGeometry(geometry, data);
    if (boundary) data.entries.push({ number, values: { boundary } });
  }
  if (!data.entries.length)
    return importError('tr_territoryImportNoSupportedMaps');
  return data;
};

export const parseTerritoryKML = (source: string) => {
  if (/<!DOCTYPE|<!ENTITY/i.test(source))
    return importError('tr_territoryImportInvalidFile');
  const xml = new DOMParser().parseFromString(source, 'application/xml');
  if (
    xml.getElementsByTagName('parsererror').length ||
    xml.documentElement.localName !== 'kml'
  )
    return importError('tr_territoryImportInvalidFile');
  const data = emptyTerritoryImport();
  const elements = (element: Element | Document, name: string) =>
    Array.from(element.getElementsByTagNameNS('*', name));
  for (const placemark of elements(xml, 'Placemark')) {
    const polygons = elements(placemark, 'Polygon');
    if (
      polygons.length !== 1 ||
      elements(placemark, 'innerBoundaryIs').length
    ) {
      importNotice(
        data,
        polygons.length
          ? 'tr_territoryImportComplexBoundary'
          : 'tr_territoryImportAnnotationsSkipped'
      );
      continue;
    }
    const explicit = elements(placemark, 'Data').find(
      (item) => item.getAttribute('name')?.toLowerCase() === 'number'
    );
    const number =
      (explicit && elements(explicit, 'value')[0]?.textContent?.trim()) ||
      elements(placemark, 'name')[0]?.textContent?.trim();
    if (!number) return importError('tr_territoryImportNumberRequired');
    const coordinates = elements(
      polygons[0],
      'coordinates'
    )[0]?.textContent?.trim();
    if (!coordinates)
      return importError('tr_territoryImportInvalidBoundary', number);
    const boundary = importBoundary(
      coordinates.split(/\s+/).map((item) => item.split(',').map(Number))
    );
    data.entries.push({ number, values: { boundary } });
  }
  if (!data.entries.length)
    return importError('tr_territoryImportNoSupportedMaps');
  return data;
};
