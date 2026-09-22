import { createElement } from 'react';
import * as maplibregl from 'maplibre-gl';
import { getCSSPropertyValue } from '@utils/common';
import {
  Territory,
  TerritoryBoundary,
  TerritoryMapMarker,
} from '@definition/territory';
import { MAP_COLORS, pinLabel } from './constants';

// legend colors are CSS variables; maplibre needs the resolved value
export const resolveColor = (color: string) =>
  color.startsWith('--') ? getCSSPropertyValue(color) : color;

type BoundaryFeature = GeoJSON.Feature<GeoJSON.Polygon>;

const boundaryFeature = (
  territory: Territory,
  options: {
    color: string;
    detail: string;
    selected: boolean;
  }
): BoundaryFeature => ({
  type: 'Feature',
  id: territory.id,
  properties: {
    id: territory.id,
    number: territory.number,
    households: territory.households,
    selected: options.selected,
    detail: options.detail,
    color: options.color,
  },
  geometry: { type: 'Polygon', coordinates: [territory.boundary ?? []] },
});

export const boundaryCollection = (
  territories: Territory[],
  options: {
    colorOf: (territory: Territory) => string;
    detailOf: (territory: Territory) => string;
    selectedId?: string;
    hiddenId?: string;
  }
): GeoJSON.FeatureCollection<GeoJSON.Polygon> => ({
  type: 'FeatureCollection',
  features: territories
    .filter(
      (territory) =>
        territory.boundary?.length && territory.id !== options.hiddenId
    )
    .map((territory) =>
      boundaryFeature(territory, {
        color: options.colorOf(territory),
        detail: options.detailOf(territory),
        selected: territory.id === options.selectedId,
      })
    ),
});

export const boundaryBounds = (boundary: TerritoryBoundary) =>
  boundary.reduce(
    (bounds, [lng, lat]) => [
      Math.min(bounds[0], lng),
      Math.min(bounds[1], lat),
      Math.max(bounds[2], lng),
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  ) as [number, number, number, number];

// terra draw rejects coordinates more precise than it stores
export const roundPosition = ([lng, lat]: GeoJSON.Position) =>
  [Math.round(lng * 1e7) / 1e7, Math.round(lat * 1e7) / 1e7] as [
    number,
    number,
  ];

// terra draw hands back a polygon ring; the store keeps it closed
export const toBoundary = (
  coordinates: GeoJSON.Position[]
): TerritoryBoundary => {
  const ring = coordinates.map(roundPosition);

  const [first] = ring;
  const last = ring[ring.length - 1];

  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    ring.push(first);
  }

  return ring;
};

export const lineCollection = (
  territories: Territory[]
): GeoJSON.FeatureCollection<GeoJSON.LineString> => ({
  type: 'FeatureCollection',
  features: territories.flatMap((territory) =>
    (territory.mapLines ?? []).map((line) => ({
      type: 'Feature' as const,
      id: line.id,
      properties: { style: line.style, territory: territory.id },
      geometry: { type: 'LineString' as const, coordinates: line.path },
    }))
  ),
});

export const shapeCollection = (
  territories: Territory[]
): GeoJSON.FeatureCollection<GeoJSON.Polygon> => ({
  type: 'FeatureCollection',
  features: territories.flatMap((territory) =>
    (territory.mapShapes ?? []).map((shape) => ({
      type: 'Feature' as const,
      id: shape.id,
      properties: {
        fill: shape.fill === 'transparent' ? '' : MAP_COLORS[shape.fill],
        border: shape.border === 'transparent' ? '' : MAP_COLORS[shape.border],
        label: shape.label ?? '',
      },
      geometry: { type: 'Polygon' as const, coordinates: [shape.path] },
    }))
  ),
});

export const allMarkers = (territories: Territory[]): TerritoryMapMarker[] =>
  territories.flatMap((territory) => territory.mapMarkers ?? []);

export const chip = (item: TerritoryMapMarker) => ({
  background: MAP_COLORS[item.color ?? (item.kind === 'text' ? 'red' : 'blue')],
  label:
    item.kind === 'text'
      ? (item.text ?? '')
      : item.text || pinLabel(item.pinType),
});

// a label on the polygon itself repeats on every tile the area crosses
export const labelCollection = (
  areas: GeoJSON.FeatureCollection<GeoJSON.Polygon>
): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: 'FeatureCollection',
  features: areas.features.map((feature) => {
    const ring = feature.geometry.coordinates[0].slice(0, -1);
    const lng = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
    const lat = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;

    return {
      type: 'Feature' as const,
      properties: feature.properties,
      geometry: { type: 'Point' as const, coordinates: [lng, lat] },
    };
  }),
});

export const addAttribution = (map: maplibregl.Map) =>
  map.addControl(
    new maplibregl.AttributionControl({ compact: true }),
    'bottom-left'
  );

const HOUSE_ICON = 'territory-house';

// maplibre only draws raster images inside labels, so the icon is rendered to one
export const addHouseIcon = async (map: maplibregl.Map, color: string) => {
  const [{ renderToStaticMarkup }, { IconHome }] = await Promise.all([
    import('react-dom/server'),
    import('@icons/index'),
  ]);

  const svg = renderToStaticMarkup(createElement(IconHome, { color }));

  const image = new Image(28, 28);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 28;

  const context = canvas.getContext('2d');
  if (!context || !map.getStyle()) return;

  context.drawImage(image, 0, 0, 28, 28);

  if (map.hasImage(HOUSE_ICON)) map.removeImage(HOUSE_ICON);

  map.addImage(HOUSE_ICON, context.getImageData(0, 0, 28, 28), {
    pixelRatio: 2,
  });
  map.triggerRepaint();
};

export const labelText = (
  options: { showNumbers: boolean; showHouseholds: boolean },
  fonts: { regular: readonly string[]; bold: readonly string[] }
): maplibregl.ExpressionSpecification | string => {
  const parts: unknown[] = [];

  if (options.showNumbers) {
    parts.push(['get', 'number'], {
      'font-scale': 1.35,
      'text-font': ['literal', fonts.bold],
    });
  }

  parts.push(parts.length ? '\n' : '', {}, ['get', 'detail'], {
    'font-scale': 0.85,
    'text-font': ['literal', fonts.regular],
  });

  if (options.showHouseholds) {
    parts.push('\n', {});

    parts.push(
      ['image', HOUSE_ICON],
      {},
      ' ',
      {},
      ['to-string', ['get', 'households']],
      { 'font-scale': 0.95, 'text-font': ['literal', fonts.regular] }
    );
  }

  return parts.length
    ? (['format', ...parts] as maplibregl.ExpressionSpecification)
    : '';
};
