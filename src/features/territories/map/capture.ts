import {
  streetRuns,
  streetLength,
  streetMidpoint,
} from '@features/territories/map/street_runs';
import { mapRequest } from '@services/maps/offline';
import { mapPerformanceOptions } from '@services/maps/performance';
import * as maplibregl from 'maplibre-gl';
import { Territory } from '@definition/territory';
import {
  DEFAULT_PROVIDER,
  MAP_COLORS,
  MAP_EXPORT_PADDING,
  MAP_PROVIDER,
} from '@features/territories/map/constants';
import {
  applyBasemapOptions,
  DEFAULT_BASEMAP,
  isBuildingOutline,
  isHouseNumber,
  isStreetName,
} from '@features/territories/map/basemap';
import { boundaryBounds } from '@features/territories/map/helpers';
import {
  addDoNotCallLayer,
  addOutsideVeil,
  addTerritoryLayers,
  setDoNotCallData,
} from '@features/territories/map/layers';
import { paintMarkers } from '@features/territories/map/markers';

// metres from a street's middle to its edge, for an ordinary residential street;
// the border's own half width is added per print, from its zoom
const STREET_HALF = 4;

// the ring moved outward by a distance in metres, corners mitred (at most twice as far)
const widen = (ring: [number, number][], metres: number) => {
  const open =
    ring.length > 1 &&
    ring[0][0] === ring.at(-1)![0] &&
    ring[0][1] === ring.at(-1)![1]
      ? ring.slice(0, -1)
      : ring;
  const kx = 111320 * Math.cos((open[0][1] * Math.PI) / 180);
  const ky = 110540;
  const points = open.map(([lng, lat]) => [lng * kx, lat * ky]);

  const area = points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - nx * y;
  }, 0);
  // outward is to the right of a counter-clockwise ring, to the left of a clockwise one
  const side = area > 0 ? 1 : -1;

  const normal = (a: number[], b: number[]) => {
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const length = Math.hypot(dx, dy) || 1;
    return [(side * dy) / length, (-side * dx) / length];
  };

  const moved = points.map((point, i) => {
    const before = points[(i - 1 + points.length) % points.length];
    const after = points[(i + 1) % points.length];
    const [ax, ay] = normal(before, point);
    const [bx, by] = normal(point, after);
    const [mx, my] = [ax + bx, ay + by];
    const length = Math.hypot(mx, my) || 1;
    const cos = (mx * ax + my * ay) / length;
    const reach = Math.min(metres / Math.max(cos, 0.5), metres * 2);
    return [
      (point[0] + (mx / length) * reach) / kx,
      (point[1] + (my / length) * reach) / ky,
    ] as [number, number];
  });

  return [...moved, moved[0]];
};

const closed = (ring: [number, number][]) => {
  const [first, last] = [ring[0], ring.at(-1)!];
  return first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
};

// the longer side of the picture; the other follows the frame it is printed in
const SIZE = 1040;

// print resolution; the layout stays at SIZE, only the pixel density grows
const DPI = 300;

const addPrintDoNotCalls = (
  map: maplibregl.Map,
  territory: Territory,
  detail: boolean
) => {
  // on paper the marked houses show at any zoom, to be skipped at the door
  addDoNotCallLayer(map, 0);
  setDoNotCallData(map, [territory]);

  // on paper a ring only needs to hold a house number
  if (detail) {
    map.setPaintProperty('do-not-calls', 'circle-radius', 5.5);
    map.setPaintProperty('do-not-calls', 'circle-stroke-width', 1.5);
  }

  // a small card has no house numbers to ring, so a house is a small solid dot
  if (!detail) {
    map.setPaintProperty('do-not-calls', 'circle-radius', 3.5);
    map.setPaintProperty('do-not-calls', 'circle-opacity', 1);
    map.setPaintProperty('do-not-calls', 'circle-color', MAP_COLORS.red);
    map.setPaintProperty('do-not-calls', 'circle-stroke-color', '#FFFFFF');
    map.setPaintProperty('do-not-calls', 'circle-stroke-width', 1);
  }
};

const showPrintBuildings = (map: maplibregl.Map) => {
  for (const layer of map.getStyle().layers) {
    if (isBuildingOutline(layer)) map.setLayerZoomRange(layer.id, 0, 24);
  }
};

const stylePrintLabels = (map: maplibregl.Map, detail: boolean) => {
  const streets: string[] = [];
  // street names and house numbers stay readable on paper, above the
  // veil, the border and every drawing; paper is light whatever the app theme
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue;

    // road numbers like B57 would sit on the border; the card needs street names only
    if (/shield/.test(layer.id)) {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      continue;
    }

    map.moveLayer(layer.id);
    if (layer.layout?.['text-field'] === undefined) continue;

    map.setPaintProperty(layer.id, 'text-color', '#333333');
    map.setPaintProperty(layer.id, 'text-halo-color', '#FFFFFF');

    if (isStreetName(layer)) streets.push(layer.id, `${layer.id}-inside`);

    // a large card has room for each house and its number, at any zoom
    if (detail && isHouseNumber(layer)) {
      map.setLayerZoomRange(layer.id, 0, 24);
      map.setLayoutProperty(layer.id, 'text-size', 8);
      map.setPaintProperty(layer.id, 'text-color', '#777777');
    }
  }

  if (detail) showPrintBuildings(map);
  return streets;
};

const addPrintLabels = (
  map: maplibregl.Map,
  boundary: [number, number][],
  detail: boolean
) => {
  const streets = stylePrintLabels(map, detail);

  const area: maplibregl.ExpressionSpecification = [
    'within',
    { type: 'Polygon', coordinates: [closed(boundary)] },
  ];

  for (const id of streets.filter((name) => !name.endsWith('-inside'))) {
    const spec = map.getStyle().layers.find((layer) => layer.id === id);
    if (spec?.type !== 'symbol') continue;

    const filter = spec.filter ?? true;
    map.setFilter(id, [
      'all',
      filter,
      ['!', area],
    ] as maplibregl.FilterSpecification);
    map.addLayer({
      ...spec,
      id: `${id}-inside`,
      minzoom: 0,
      maxzoom: 24,
      filter: ['all', filter, area] as maplibregl.FilterSpecification,
      layout: { ...spec.layout, 'text-padding': 0, 'symbol-spacing': 90 },
    });
  }
  return streets;
};

/**
 * Renders the territory on an off-screen map and returns it as a PNG data URL.
 * Printing needs a picture, and the same drawing the congregation edits is the
 * only one that is guaranteed to be current.
 */
const capture = (
  territory: Territory,
  ratio: number,
  inset: number,
  printedPoints: number,
  detail: boolean,
  doNotCalls: boolean
) =>
  new Promise<string | undefined>((resolve) => {
    const boundary = territory.boundary;

    if (!boundary?.length) {
      resolve(undefined);
      return;
    }

    const width = ratio >= 1 ? SIZE : Math.round(SIZE * ratio);
    const height = ratio >= 1 ? Math.round(SIZE / ratio) : SIZE;

    const container = document.createElement('div');
    container.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:${height}px`;
    document.body.appendChild(container);

    const [west, south, east, north] = boundaryBounds(boundary);
    // Leave surrounding streets visible between the territory and the map edges.
    const horizontalPadding = Math.round(width * MAP_EXPORT_PADDING);
    const verticalPadding = Math.round(height * MAP_EXPORT_PADDING);

    let map: maplibregl.Map;
    try {
      const tuned = mapPerformanceOptions();

      map = new maplibregl.Map({
        container,
        // the card is printed on white paper, so always the light basemap
        style: MAP_PROVIDER.light,
        bounds: [west, south, east, north],
        fitBoundsOptions: {
          padding: {
            top: verticalPadding,
            right: horizontalPadding,
            left: horizontalPadding,
            // the printed label covers this share of the bottom
            bottom: verticalPadding + Math.round(height * inset),
          },
        },
        interactive: false,
        transformRequest: mapRequest,
        attributionControl: false,
        ...tuned,
        // the picture has a fixed size, whatever the screen
        pixelRatio: (printedPoints / 72) * (DPI / SIZE),
        maxTileCacheSize: Math.min(32, tuned.maxTileCacheSize),
        canvasContextAttributes: {
          ...tuned.canvasContextAttributes,
          preserveDrawingBuffer: true,
          antialias: true,
        },
      });
    } catch {
      container.remove();
      resolve(undefined);
      return;
    }

    let done = false;

    const cleanup = (result?: string) => {
      if (done) return;
      done = true;

      window.clearTimeout(timeout);
      try {
        map.remove();
      } finally {
        container.remove();
        resolve(result);
      }
    };

    const timeout = window.setTimeout(() => cleanup(), 12000);

    let styled = false;
    const streets: string[] = [];

    map.on('style.load', () => {
      styled = true;
      applyBasemapOptions(map, DEFAULT_PROVIDER, DEFAULT_BASEMAP);

      // borders run along the middle of a street; on paper the line moves out past
      // it, so the street itself reads as part of the territory
      const width = detail ? 8 : 5.5;
      const metresPerPixel =
        (40075016.686 * Math.cos((boundary[0][1] * Math.PI) / 180)) /
        (512 * 2 ** map.getZoom());
      const printed = widen(
        boundary,
        STREET_HALF + (width / 2) * metresPerPixel
      );

      addOutsideVeil(map, printed, '#FFFFFF');
      addTerritoryLayers(map, { ...territory, boundary: printed }, 0);
      if (doNotCalls) addPrintDoNotCalls(map, territory, detail);
      // a printed border has to hold its own against the street names above it,
      // and on a large card against the houses and their numbers too
      map.setPaintProperty('territory-area-line', 'line-width', width);
      // the picture is always this size and printed smaller, so its dashes
      // are long enough not to read as dots at any zoom
      map.setPaintProperty(
        'territory-lines-dashed-selected',
        'line-dasharray',
        [4, 3]
      );

      streets.push(...addPrintLabels(map, boundary, detail));
    });

    const snapshot = () => {
      if (done) return;
      const canvas = document.createElement('canvas');
      try {
        canvas.width = map.getCanvas().width;
        canvas.height = map.getCanvas().height;
        const context = canvas.getContext('2d');
        if (!context) {
          cleanup();
          return;
        }
        context.drawImage(map.getCanvas(), 0, 0);
        paintMarkers(canvas, map, territory.mapMarkers ?? [], 2);
        cleanup(canvas.toDataURL('image/png'));
      } catch {
        cleanup();
      } finally {
        canvas.width = 0;
        canvas.height = 0;
      }
    };

    const levelOrSnapshot = () => {
      const all = [...streets, 'short-streets-along'];
      if (labelShortStreets(map, boundary, all, false)) {
        map.once('idle', snapshot);
      } else snapshot();
    };

    map.once('idle', () => {
      if (labelShortStreets(map, boundary, streets, true)) {
        map.once('idle', levelOrSnapshot);
      } else levelOrSnapshot();
    });

    // a missing tile still leaves a usable picture; only a basemap that never loads fails
    map.on('error', () => {
      if (!styled) cleanup();
    });
  });

// a street too short for its name at the style's size gets a smaller one along its
// own course; only a name that still finds no room is set level on its middle
const streetCoordinates = (geometry: GeoJSON.Geometry): number[][][] => {
  if (geometry.type === 'LineString') return [geometry.coordinates];
  if (geometry.type === 'MultiLineString') return geometry.coordinates;
  return [];
};

const missingStreetRuns = (
  map: maplibregl.Map,
  spec: maplibregl.SymbolLayerSpecification,
  boundary: [number, number][],
  shown: Set<string>
) => {
  const runs = new Map<string, number[][]>();

  for (const feature of map.querySourceFeatures(spec.source, {
    sourceLayer: spec['source-layer'],
  })) {
    const name = feature.properties.name;
    if (!name || shown.has(name)) continue;

    const lines = streetCoordinates(feature.geometry);

    // Tile vertices need not fall inside the boundary. Keep the longest visible run.
    for (const line of lines) {
      for (const run of streetRuns(line, boundary)) {
        if (streetLength(run) > streetLength(runs.get(name) ?? [])) {
          runs.set(name, run);
        }
      }
    }
  }

  return runs;
};

const labelShortStreets = (
  map: maplibregl.Map,
  boundary: [number, number][],
  layers: string[],
  along: boolean
) => {
  const spec = map.getStyle().layers.find((layer) => layer.id === layers[0]);
  if (spec?.type !== 'symbol') return false;

  const shown = new Set(
    map
      .queryRenderedFeatures({
        // An outside label must not suppress a useful label inside the territory.
        layers: layers.filter(
          (id) =>
            map.getLayer(id) &&
            (id.endsWith('-inside') || id.startsWith('short-streets-'))
        ),
      })
      .map((feature) => feature.properties.name)
  );

  const runs = missingStreetRuns(map, spec, boundary, shown);

  const id = along ? 'short-streets-along' : 'short-streets-level';
  const features = [...runs]
    .filter(([, run]) => !along || run.length > 1)
    .map(([name, run]) => ({
      type: 'Feature' as const,
      properties: { name },
      geometry: along
        ? { type: 'LineString' as const, coordinates: run }
        : {
            type: 'Point' as const,
            coordinates: streetMidpoint(run),
          },
    }));

  if (!features.length) return false;

  map.addSource(id, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });

  map.addLayer({
    id,
    type: 'symbol',
    source: id,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': spec.layout?.['text-font'],
      'text-size': 10,
      'text-padding': 0,
      'text-allow-overlap': false,
      'text-ignore-placement': false,
      ...(along
        ? {
            'symbol-placement': 'line-center' as const,
            'text-max-angle': 80,
            'text-keep-upright': true,
          }
        : {
            'text-variable-anchor': [
              'center',
              'top',
              'bottom',
              'left',
              'right',
            ],
            'text-radial-offset': 0.6,
          }),
    },
    paint: {
      'text-color': '#333333',
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 1.5,
    },
  });

  return true;
};

let captures: Promise<unknown> = Promise.resolve();
export const captureTerritoryMap = (
  territory: Territory,
  ratio = 1.74,
  inset = 0,
  printedPoints = SIZE * 0.24,
  detail = false,
  doNotCalls = false
): Promise<string | undefined> => {
  const next = captures.then(() =>
    capture(territory, ratio, inset, printedPoints, detail, doNotCalls)
  );
  captures = next.catch(() => {});
  return next;
};
