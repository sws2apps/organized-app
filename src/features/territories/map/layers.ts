import * as maplibregl from 'maplibre-gl';
import { Territory } from '@definition/territory';
import {
  DEFAULT_BOUNDARY_STYLE,
  MAP_COLORS,
} from '@features/territories/map/constants';
import { mapDetail } from '@services/maps/performance';
import {
  boundaryCollection,
  drawnColor,
  lineCollection,
  shapeCollection,
  labelOpacity,
} from '@features/territories/map/helpers';

// the dashed lines inside a territory are drawn as thick as its border
export const BORDER_WIDTH: maplibregl.ExpressionSpecification = [
  'case',
  ['boolean', ['get', 'selected'], false],
  3,
  1.5,
];

export const FILL_OPACITY: maplibregl.ExpressionSpecification = [
  'case',
  ['get', 'filled'],
  ['case', ['get', 'selected'], 0.45, 0.18],
  0,
];

export const addBoundaryLayers = (
  map: maplibregl.Map,
  source: string,
  ids: { fill: string; line: string }
) => {
  const lineJoin = mapDetail().lineJoin;

  map.addLayer({
    id: ids.fill,
    type: 'fill',
    source,
    paint: { 'fill-color': ['get', 'fill'], 'fill-opacity': FILL_OPACITY },
  });

  map.addLayer({
    id: ids.line,
    type: 'line',
    source,
    layout: {
      'line-join': lineJoin,
      'line-cap': lineJoin === 'round' ? 'round' : 'butt',
    },
    paint: { 'line-color': ['get', 'color'], 'line-width': BORDER_WIDTH },
  });
};

const drawingLineLayout = () => {
  const lineJoin = mapDetail().lineJoin;
  return {
    'line-join': lineJoin,
    'line-cap': lineJoin === 'round' ? ('round' as const) : ('butt' as const),
  };
};

const addShapeLayers = (map: maplibregl.Map, prefix: string) => {
  map.addLayer({
    id: `${prefix}-shapes-fill`,
    type: 'fill',
    source: `${prefix}-shapes`,
    filter: ['!=', ['get', 'fill'], ''],
    paint: { 'fill-color': ['get', 'fill'], 'fill-opacity': 0.35 },
  });

  for (const dashed of [false, true]) {
    map.addLayer({
      id: `${prefix}-shapes-line${dashed ? '-dashed' : ''}`,
      type: 'line',
      source: `${prefix}-shapes`,
      filter: [
        'all',
        ['!=', ['get', 'border'], ''],
        ['==', ['boolean', ['get', 'dashed'], false], dashed],
      ],
      layout: drawingLineLayout(),
      paint: {
        'line-color': ['get', 'border'],
        'line-width': 2.5,
        ...(dashed && { 'line-dasharray': ['literal', [2, 1.5]] }),
      },
    });
  }
};

const addLineLayers = (map: maplibregl.Map, prefix: string) => {
  // a width that depends on the feature stretches the dashes several times,
  // so each border width gets its own layer with a fixed one
  for (const selected of [false, true]) {
    map.addLayer({
      id: `${prefix}-lines-solid${selected ? '-selected' : ''}`,
      type: 'line',
      source: `${prefix}-lines`,
      filter: [
        'all',
        ['==', ['get', 'style'], 'solid'],
        ['==', ['boolean', ['get', 'selected'], false], selected],
      ],
      layout: drawingLineLayout(),
      paint: {
        'line-color': ['get', 'color'],
        'line-width': selected ? 3 : 1.5,
        ...(!selected && { 'line-opacity': labelOpacity(1) }),
      },
    });

    map.addLayer({
      id: `${prefix}-lines-dashed${selected ? '-selected' : ''}`,
      type: 'line',
      source: `${prefix}-lines`,
      filter: [
        'all',
        ['==', ['get', 'style'], 'dashed'],
        ['==', ['boolean', ['get', 'selected'], false], selected],
      ],
      layout: drawingLineLayout(),
      paint: {
        'line-color': ['get', 'color'],
        'line-width': selected ? 3 : 1.5,
        // the lines grow longer on screen as you zoom in, so the dashes may too
        'line-dasharray': [
          'step',
          ['zoom'],
          ['literal', [1, 1]],
          16,
          ['literal', [1.5, 1]],
          18,
          ['literal', [2, 1.2]],
        ],
        // the overview stays clean: a territory's dashes come with its number
        ...(!selected && { 'line-opacity': labelOpacity(1) }),
      },
    });
  }
};

export const addDrawingLayers = (
  map: maplibregl.Map,
  territories: Territory[],
  prefix = 'drawing',
  selectedId?: string
) => {
  map.addSource(`${prefix}-shapes`, {
    type: 'geojson',
    data: shapeCollection(territories),
  });

  map.addSource(`${prefix}-lines`, {
    type: 'geojson',
    data: lineCollection(territories, selectedId),
  });

  addShapeLayers(map, prefix);
  addLineLayers(map, prefix);
};

export const setDrawingData = (
  map: maplibregl.Map,
  territories: Territory[],
  prefix = 'drawing',
  selectedId?: string
) => {
  (
    map.getSource(`${prefix}-shapes`) as maplibregl.GeoJSONSource | undefined
  )?.setData(shapeCollection(territories));

  (
    map.getSource(`${prefix}-lines`) as maplibregl.GeoJSONSource | undefined
  )?.setData(lineCollection(territories, selectedId));
};

// a do-not-call house shows close in only, where its number can be read: a red
// ring on top of the territory's fill, open inside so the number reads
export const DO_NOT_CALL_ZOOM = 15;
const DO_NOT_CALLS = 'do-not-calls';

export const doNotCallCollection = (
  territories: Territory[]
): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: territories.flatMap((territory) =>
    territory.doNotCalls
      .filter((entry) => entry.position)
      .map((entry) => ({
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'Point' as const, coordinates: entry.position! },
      }))
  ),
});

export const addDoNotCallLayer = (
  map: maplibregl.Map,
  minzoom = DO_NOT_CALL_ZOOM
) => {
  map.addSource(DO_NOT_CALLS, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  map.addLayer({
    id: DO_NOT_CALLS,
    type: 'circle',
    source: DO_NOT_CALLS,
    minzoom,
    paint: {
      // small while the street is still small, growing with the houses
      'circle-radius': [
        'interpolate',
        ['exponential', 1.4],
        ['zoom'],
        15,
        3,
        17,
        7,
        19,
        11,
        21,
        15,
      ],
      'circle-opacity': 0,
      'circle-stroke-color': MAP_COLORS.red,
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        1.5,
        19,
        2.5,
      ],
    },
  });
};

export const setDoNotCallData = (
  map: maplibregl.Map,
  territories: Territory[]
) =>
  (
    map.getSource(DO_NOT_CALLS) as maplibregl.GeoJSONSource | undefined
  )?.setData(doNotCallCollection(territories));

// one territory as the coverage map shows it once picked, in its drawn colors
export const addTerritoryLayers = (
  map: maplibregl.Map,
  territory: Territory,
  fillOpacity?: number
) => {
  const style = territory.boundaryStyle ?? DEFAULT_BOUNDARY_STYLE;

  map.addSource('territory-area', {
    type: 'geojson',
    data: boundaryCollection([territory], {
      colorOf: () => drawnColor(style.border) || MAP_COLORS.blue,
      fillOf: () => drawnColor(style.fill),
      detailOf: () => '',
      selectedId: territory.id,
    }),
  });

  addBoundaryLayers(map, 'territory-area', {
    fill: 'territory-area-fill',
    line: 'territory-area-line',
  });

  // a printed map keeps the area clear to write on
  if (fillOpacity !== undefined) {
    map.setPaintProperty('territory-area-fill', 'fill-opacity', fillOpacity);
  }

  addDrawingLayers(map, [territory], 'territory', territory.id);
};

// the world with the territory cut out, laid over the basemap so the area itself stands out
export const addOutsideVeil = (
  map: maplibregl.Map,
  boundary: [number, number][],
  color: string
) => {
  map.addSource('outside-veil', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -85],
            [180, -85],
            [180, 85],
            [-180, 85],
            [-180, -85],
          ],
          boundary,
        ],
      },
    },
  });

  map.addLayer({
    id: 'outside-veil',
    type: 'fill',
    source: 'outside-veil',
    paint: { 'fill-color': color, 'fill-opacity': 0.6 },
  });
};
