import polylabel from 'polylabel';
import { createElement } from 'react';
import * as maplibregl from 'maplibre-gl';
import { getCSSPropertyValue } from '@utils/common';
import { getTranslation } from '@services/i18n/translation';
import {
  MapColor,
  Territory,
  TerritoryBoundary,
  TerritoryMapLine,
  TerritoryMapMarker,
} from '@definition/territory';
import { mapDetail } from '@services/maps/performance';
import { MAP_COLORS, pinLabel } from '@features/territories/map/constants';

// legend colors are CSS variables; maplibre needs the resolved value
export const resolveColor = (color: string) =>
  color.startsWith('--') ? getCSSPropertyValue(color) : color;

// paper is white: the colours of the light theme, whatever the app shows
export const resolveLightColor = (color: string) => {
  if (!color.startsWith('--')) return color;
  const probe = document.createElement('div');
  probe.dataset.theme = (
    document.documentElement.dataset.theme ?? 'blue-light'
  ).replace(/-dark$/, '-light');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(color).trim();
  probe.remove();
  return value || resolveColor(color);
};

// a border has no transparent option, and an empty fill leaves the area unfilled
export const drawnColor = (color: MapColor | 'transparent') =>
  color === 'transparent' ? '' : MAP_COLORS[color];

// Consecutive duplicates or micro-steps (< 1e-6 deg, approx 10cm) cause zero-length
// segments in WebGL line tessellation, dividing by zero in miter/normal calculations.
export const sanitizeCoordinates = <
  T extends [number, number] | GeoJSON.Position,
>(
  coords: T[]
): T[] => {
  if (coords.length < 2) return coords;
  const result: T[] = [coords[0]];
  for (let i = 1; i < coords.length; i++) {
    const prev = result.at(-1)!;
    const curr = coords[i];
    if (
      Math.abs(curr[0] - prev[0]) > 1e-6 ||
      Math.abs(curr[1] - prev[1]) > 1e-6
    ) {
      result.push(curr);
    }
  }
  return result;
};

// with the inside on the left, a line offset to the right runs outside
// a ring stored open is closed for drawing: MapLibre strokes an open ring
// as a line with two loose ends, which shows as a notch where it starts,
// worst on an offset border at a sharp corner
export const closedRing = (ring: TerritoryBoundary): TerritoryBoundary => {
  if (ring.length < 3) return ring;
  const [first, last] = [ring[0], ring.at(-1)!];
  return first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
};

export const counterClockwise = (
  ring: TerritoryBoundary
): TerritoryBoundary => {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * y2 - x2 * y1;
  }
  return area < 0 ? [...ring].reverse() : ring;
};

export const sanitizeBoundary = (
  boundary: TerritoryBoundary
): TerritoryBoundary => {
  const cleaned = sanitizeCoordinates(boundary);
  if (cleaned.length < 3) return boundary;
  const first = cleaned[0];
  const last = cleaned.at(-1)!;
  if (first[0] !== last[0] || first[1] !== last[1]) {
    cleaned.push(first);
  }
  return cleaned as TerritoryBoundary;
};

type BoundaryFeature = GeoJSON.Feature<GeoJSON.Polygon>;

const boundaryFeature = (
  territory: Territory,
  options: {
    color: string;
    fill?: string;
    detail: string;
    selected: boolean;
    sanitize?: boolean;
  }
): BoundaryFeature => {
  const boundary =
    options.sanitize && territory.boundary
      ? sanitizeBoundary(territory.boundary)
      : (territory.boundary ?? []);

  return {
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
    geometry: { type: 'Polygon', coordinates: [closedRing(boundary)] },
  };
};

export const boundaryCollection = (
  territories: Territory[],
  options: {
    colorOf: (territory: Territory) => string;
    // empty leaves the area unfilled; without it the fill follows the border
    fillOf?: (territory: Territory) => string;
    detailOf: (territory: Territory) => string;
    selectedId?: string;
    hiddenId?: string;
    sanitize?: boolean;
  }
): GeoJSON.FeatureCollection<GeoJSON.Polygon> => {
  const shouldSanitize = options.sanitize ?? mapDetail().sanitizeGeometry;

  return {
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
          sanitize: shouldSanitize,
        })
      ),
  };
};

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

// where the congregation works, for a map with no territory of its own to show
export const congregationBounds = (
  territories: Territory[],
  congregationBoundary?: TerritoryBoundary
) => {
  const points = congregationBoundary?.length
    ? congregationBoundary
    : territories.flatMap((territory) => territory.boundary ?? []);

  return points.length ? boundaryBounds(points) : undefined;
};

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

export const lineColor = (line: Pick<TerritoryMapLine, 'style' | 'color'>) =>
  line.color ?? (line.style === 'dashed' ? 'red' : 'blue');

export const lineCollection = (
  territories: Territory[],
  selectedId?: string,
  options?: { sanitize?: boolean }
): GeoJSON.FeatureCollection<GeoJSON.LineString> => {
  const shouldSanitize = options?.sanitize ?? mapDetail().sanitizeGeometry;

  return {
    type: 'FeatureCollection',
    features: territories.flatMap((territory) =>
      (territory.mapLines ?? []).flatMap((line) => {
        const path = shouldSanitize
          ? sanitizeCoordinates(line.path)
          : line.path;
        if (path.length < 2) return [];

        return [
          {
            type: 'Feature' as const,
            id: line.id,
            properties: {
              style: line.style,
              color: MAP_COLORS[lineColor(line)],
              territory: territory.id,
              selected: territory.id === selectedId,
              // the dashes show together with the territory's number
              labelZoom:
                (territory.boundary?.length ?? 0) > 2
                  ? labelZoom(
                      territory.boundary!,
                      numberBox(String(territory.number ?? '')),
                      0
                    )
                  : 0,
            },
            geometry: { type: 'LineString' as const, coordinates: path },
          },
        ];
      })
    ),
  };
};

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
        dashed: !!shape.dashed,
      },
      geometry: { type: 'Polygon' as const, coordinates: [shape.path] },
    }))
  ),
});

// each part's letter with the border it shows inside
export const letterFrames = (territories: Territory[]) =>
  new Map(
    territories.flatMap((territory) =>
      (territory.mapMarkers ?? [])
        .filter(isAreaLetter)
        .map((item) => [item.id, territory.boundary ?? []] as const)
    )
  );

export const allMarkers = (territories: Territory[]): TerritoryMapMarker[] =>
  territories.flatMap((territory) => territory.mapMarkers ?? []);

// a part's letter (A, B, C) is read with the whole territory in view
export const isAreaLetter = (item: TerritoryMapMarker) =>
  item.kind === 'text' && /^[A-Z]{1,2}$/.test(item.text ?? '');

export const chip = (item: TerritoryMapMarker) => ({
  background: MAP_COLORS[item.color ?? (item.kind === 'text' ? 'red' : 'blue')],
  label:
    item.kind === 'text'
      ? (item.text ?? '')
      : item.text || getTranslation({ key: pinLabel(item.pinType) }),
});

const EARTH_METRES = 40_075_016.686;

type LabelBox = { width: number; height: number };

const numberBox = (number: string): LabelBox => ({
  width: 8 + 7 * number.length,
  height: 18,
});

const textWidth = (text: string) => 8 + 6.5 * text.length;

const captionBox = (
  number: string,
  detail: string,
  households?: string
): LabelBox => {
  const widths: number[] = [];
  if (detail) widths.push(textWidth(detail));
  // the house icon is about as wide as three letters
  if (households) widths.push(textWidth(households) + 20);

  const badge = numberBox(number);

  return {
    width: Math.max(badge.width, ...widths),
    height: badge.height + 14 * widths.length,
  };
};

// maplibre can't measure a polygon on screen, so each label carries the zoom
// from which its territory is big enough to hold the label's box
// `unknown`: the zoom for a border too thin to measure
const labelZoom = (ring: GeoJSON.Position[], box: LabelBox, unknown = 24) => {
  const [west, south, east, north] = boundaryBounds(ring as TerritoryBoundary);
  const scale = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const perDegree = EARTH_METRES / 360;

  const width = (east - west) * perDegree * scale;
  const height = (north - south) * perDegree;

  // a thin or bent area holds less than its box
  const area =
    Math.abs(
      ring.reduce((sum, [x1, y1], index) => {
        const [x2, y2] = ring[(index + 1) % ring.length];
        return sum + x1 * y2 - x2 * y1;
      }, 0) / 2
    ) *
    perDegree *
    perDegree *
    scale;
  const fill = Math.sqrt(area / (width * height)) || 0;

  // at zoom z a 512 px world tile spans the earth, so a metre is
  // 512 * 2^z / (EARTH_METRES * scale) pixels
  const zoomFor = (pixels: number, metres: number) =>
    Math.log2((pixels * EARTH_METRES * scale) / (512 * metres));

  const zoom = Math.max(
    zoomFor(box.width, width * fill),
    zoomFor(box.height, height * fill)
  );

  return Number.isFinite(zoom) ? Math.min(zoom, 24) : unknown;
};

// a label on the polygon itself repeats on every tile the area crosses
// the point deepest inside the area (Mapbox's polylabel), so a number never
// lands on a border, as an average of the corners can; longitudes are
// squeezed to true distances first
const labelPoint = (rings: GeoJSON.Position[][]) => {
  const lat =
    rings[0].reduce((sum, point) => sum + point[1], 0) / rings[0].length;
  const scale = Math.cos((lat * Math.PI) / 180);
  const squeezed = rings.map((ring) =>
    ring.map(([x, y]): [number, number] => [x * scale, y])
  );
  const [x, y] = polylabel(squeezed, 0.00002);
  return [x / scale, y];
};

export const labelCollection = (
  areas: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
  options: { households?: boolean } = {}
): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: 'FeatureCollection',
  features: areas.features.map((feature) => {
    const ring = feature.geometry.coordinates[0].slice(0, -1);
    const [lng, lat] = labelPoint(feature.geometry.coordinates);

    const number = String(feature.properties?.number ?? '');
    const detail = String(feature.properties?.detail ?? '');
    const households = options.households
      ? String(feature.properties?.households ?? '')
      : undefined;

    return {
      type: 'Feature' as const,
      properties: {
        ...feature.properties,
        labelZoom: labelZoom(ring, numberBox(number)),
        // the caption waits until the area has room for it under the badge
        captionZoom: labelZoom(ring, captionBox(number, detail, households)),
      },
      geometry: { type: 'Point' as const, coordinates: [lng, lat] },
    };
  }),
});

// starts folded into the info button, so the credits never cover the map
// maplibre's own control labels, in the app's language
export const mapLocale = () => ({
  'AttributionControl.ToggleAttribution': getTranslation({
    key: 'tr_territoryToggleAttribution',
  }),
  'Map.Title': getTranslation({ key: 'tr_territoryMap' }),
});

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

// captions only show from LABEL_DETAIL_ZOOM, and keep growing when close in
export const CAPTION_TEXT_SIZE: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  13,
  10,
  15,
  12,
  17,
  14,
  19,
  16,
];

// a label fades in over half a zoom level once its territory can hold it;
// zoom stops can't come from a feature, so the ramp is sampled every half level
export const labelOpacity = (
  opacity: number,
  from: 'labelZoom' | 'captionZoom' = 'labelZoom'
): maplibregl.ExpressionSpecification => {
  if (mapDetail().simpleOpacityShader) {
    // on older mobile GPUs: a simple step avoids compiling 49 nested stops in GLSL
    return [
      'case',
      ['>=', ['zoom'], ['get', from]],
      opacity,
      0,
    ] as maplibregl.ExpressionSpecification;
  }

  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    ...Array.from({ length: 49 }, (_, index) => index / 2).flatMap((zoom) => [
      zoom,
      [
        '*',
        opacity,
        ['max', 0, ['min', 1, ['*', 2, ['-', zoom, ['get', from]]]]],
      ],
    ]),
  ] as maplibregl.ExpressionSpecification;
};

// labels too small to show yet leave room for others, the street names too
export const LABEL_FILTER: maplibregl.FilterSpecification = [
  '<',
  ['get', 'labelZoom'],
  ['+', ['zoom'], 1],
];

export const CAPTION_FILTER: maplibregl.FilterSpecification = [
  '<',
  ['get', 'captionZoom'],
  ['+', ['zoom'], 1],
];
