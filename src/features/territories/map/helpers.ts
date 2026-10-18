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
    fill?: string;
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
    fill: options.fill || options.color,
    filled: options.fill !== '',
  },
  geometry: { type: 'Polygon', coordinates: [territory.boundary ?? []] },
});

export const boundaryCollection = (
  territories: Territory[],
  options: {
    colorOf: (territory: Territory) => string;
    // empty leaves the area unfilled; without it the fill follows the border
    fillOf?: (territory: Territory) => string;
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
        fill: options.fillOf?.(territory),
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
  const last = ring.at(-1);

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

// starts folded into the info button, so the credits never cover the map
export const addAttribution = (map: maplibregl.Map) => {
  map.addControl(
    new maplibregl.AttributionControl({ compact: true }),
    'bottom-left'
  );

  map.once('load', () => {
    const control = map.getContainer().querySelector('.maplibregl-ctrl-attrib');

    control?.classList.remove('maplibregl-compact-show');
    control?.removeAttribute('open');
  });
};

export const LABEL_BACKGROUND = 'territory-label-background';

// a text halo traces every glyph and looks ragged on busy maps
export const addLabelBackground = (
  map: maplibregl.Map,
  fill: string,
  border: string
) => {
  const ratio = 2;
  const size = 16 * ratio;
  const radius = 4 * ratio;
  const line = 1 * ratio;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return;

  const inset = line / 2;

  context.beginPath();
  context.roundRect(inset, inset, size - line, size - line, radius);
  context.fillStyle = fill;
  context.fill();
  context.lineWidth = line;
  context.strokeStyle = border;
  context.stroke();

  if (map.hasImage(LABEL_BACKGROUND)) map.removeImage(LABEL_BACKGROUND);

  // only the flat middle stretches, so the corners keep their radius
  const middle: [number, number] = [radius + line, size - radius - line];

  map.addImage(LABEL_BACKGROUND, context.getImageData(0, 0, size, size), {
    pixelRatio: ratio,
    stretchX: [middle],
    stretchY: [middle],
    // the background hugs the number instead of padding by the corners
    content: [line, line, size - line, size - line],
  });
};

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

type LabelFonts = {
  regular: readonly string[];
  bold: readonly string[];
  number: readonly string[];
};

export const numberText = (fonts: LabelFonts) =>
  [
    'format',
    ['get', 'number'],
    { 'font-scale': 1.25, 'text-font': ['literal', fonts.number] },
  ] as maplibregl.ExpressionSpecification;

export const captionText = (
  options: { showHouseholds: boolean },
  fonts: LabelFonts
) => {
  const parts: unknown[] = [
    ['get', 'detail'],
    { 'text-font': ['literal', fonts.regular] },
  ];

  if (options.showHouseholds) {
    parts.push(
      '\n',
      {},
      ['image', HOUSE_ICON],
      {},
      ' ',
      {},
      ['to-string', ['get', 'households']],
      { 'text-font': ['literal', fonts.regular] }
    );
  }

  return ['format', ...parts] as maplibregl.ExpressionSpecification;
};

// below this zoom only the numbers show; it matches the map's opening zoom,
// so the chosen Display mode is always readable at the normal view
export const LABEL_DETAIL_ZOOM = 13;

// the caption sits just under the number badge, or in its place when the
// numbers are switched off
export const captionPlacement = (showNumbers: boolean) =>
  showNumbers
    ? { anchor: 'top' as const, offset: [0, 1.3] as [number, number] }
    : { anchor: 'center' as const, offset: [0, 0] as [number, number] };

// labels shrink as the map zooms out so they stay inside their territory
export const LABEL_TEXT_SIZE: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  11,
  8,
  13,
  10,
  15,
  12,
  17,
  13,
];
