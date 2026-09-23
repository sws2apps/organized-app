import * as maplibregl from 'maplibre-gl';
import { getCSSPropertyValue } from '@utils/common';
import { MAP_PROVIDERS, MapProviderKey } from './constants';

export type BasemapOptions = {
  houseNumbers: boolean;
  places: boolean;
  green: boolean;
  water: boolean;
  buildings: boolean;
  streetNames: boolean;
  parking: boolean;
};

export const DEFAULT_BASEMAP: BasemapOptions = {
  houseNumbers: true,
  places: true,
  green: true,
  water: true,
  buildings: true,
  streetNames: true,
  parking: true,
};

// tinted overlays for both tile schemas; a source layer a provider lacks simply draws nothing
type Overlay = {
  id: string;
  option: 'green' | 'water';
  color: string;
  opacity: number;
  parts: { layer: string; filter?: maplibregl.FilterSpecification }[];
};

const OVERLAYS: Overlay[] = [
  {
    id: 'basemap-green',
    option: 'green',
    color: '#4CAF50',
    opacity: 0.22,
    parts: [
      { layer: 'park' },
      {
        layer: 'landcover',
        filter: [
          'in',
          ['get', 'class'],
          ['literal', ['grass', 'wood', 'wetland']],
        ],
      },
      {
        layer: 'land',
        filter: [
          'in',
          ['get', 'kind'],
          [
            'literal',
            [
              'park',
              'forest',
              'grass',
              'meadow',
              'garden',
              'village_green',
              'recreation_ground',
              'cemetery',
            ],
          ],
        ],
      },
    ],
  },
  {
    id: 'basemap-water',
    option: 'water',
    color: '#2196F3',
    opacity: 0.25,
    parts: [{ layer: 'water' }, { layer: 'water_polygons' }],
  },
];

// the tile layers that carry them, in the OpenMapTiles and Shortbread schemas
const HOUSE_NUMBER_LAYERS = new Set(['housenumber', 'addresses']);
const PLACE_LAYERS = new Set(['poi', 'pois']);

const STREET_NAME_LAYERS = new Set(['transportation_name', 'street_labels']);

const HOUSE_NUMBERS = 'basemap-house-numbers';
const PLACES = 'basemap-places';
const PARKING = 'basemap-parking';
const BUILDINGS = 'basemap-buildings';

// street names from zoom 12 instead of only when close, so the way there stays readable
const STREET_NAMES_FROM = 12;

// the tiles carry both from zoom 14, so big territories can show them before street level
const HOUSE_NUMBERS_FROM = 15;
const PARKING_FROM = 14;

const sourceLayerOf = (layer: maplibregl.LayerSpecification) =>
  'source-layer' in layer ? layer['source-layer'] : undefined;

// OpenFreeMap's light style leaves out the house numbers and places its tiles carry
const addMissingLabels = (map: maplibregl.Map, provider: MapProviderKey) => {
  const style = map.getStyle();

  const drawn = (layers: Set<string>) =>
    style.layers.some((layer) => layers.has(sourceLayerOf(layer) ?? ''));

  const source = Object.entries(style.sources).find(
    ([, value]) => value.type === 'vector'
  )?.[0];
  if (!source) return;

  const label = (
    id: string,
    sourceLayer: string,
    minzoom: number,
    text: maplibregl.ExpressionSpecification
  ) =>
    map.addLayer({
      id,
      type: 'symbol',
      source,
      'source-layer': sourceLayer,
      minzoom,
      layout: {
        'text-field': text,
        'text-font': [...MAP_PROVIDERS[provider].fonts.regular],
        'text-size': 10,
      },
      paint: {
        'text-color': getCSSPropertyValue('--grey-350'),
        'text-halo-color': getCSSPropertyValue('--white'),
        'text-halo-width': 1,
      },
    });

  if (!drawn(HOUSE_NUMBER_LAYERS)) {
    label(HOUSE_NUMBERS, 'housenumber', HOUSE_NUMBERS_FROM, [
      'get',
      'housenumber',
    ]);
  }

  for (const overlay of OVERLAYS) {
    overlay.parts.forEach((part, index) => {
      const id = `${overlay.id}-${index}`;
      if (map.getLayer(id)) return;

      map.addLayer({
        id,
        type: 'fill',
        source,
        'source-layer': part.layer,
        ...(part.filter && { filter: part.filter }),
        paint: { 'fill-color': overlay.color, 'fill-opacity': overlay.opacity },
      });
    });
  }

  if (!drawn(PLACE_LAYERS)) {
    label(PLACES, 'poi', 16, [
      'coalesce',
      ['get', 'name:latin'],
      ['get', 'name'],
    ]);
  }

  // outlines make each building countable at street level
  for (const [index, layer] of ['building', 'buildings'].entries()) {
    const id = `${BUILDINGS}-${index}`;
    if (map.getLayer(id)) continue;

    map.addLayer({
      id,
      type: 'line',
      source,
      'source-layer': layer,
      minzoom: 15,
      paint: {
        'line-color': getCSSPropertyValue('--grey-350'),
        'line-width': 0.6,
        'line-opacity': 0.7,
      },
    });
  }

  const parking: [string, maplibregl.FilterSpecification][] = [
    ['poi', ['all', ['==', ['get', 'class'], 'parking'], ['has', 'name']]],
    ['pois', ['all', ['==', ['get', 'amenity'], 'parking'], ['has', 'name']]],
  ];

  parking.forEach(([layer, filter], index) => {
    const id = `${PARKING}-${index}`;
    if (map.getLayer(id)) return;

    map.addLayer({
      id,
      type: 'symbol',
      source,
      'source-layer': layer,
      filter,
      // kerbside strips are mapped as car parks too; the named ones are the real car parks
      minzoom: PARKING_FROM,
      layout: {
        'text-field': 'P',
        'text-font': [...MAP_PROVIDERS[provider].fonts.bold],
        'text-size': 12,
        'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'rank'], 0]],
      },
      paint: {
        'text-color': getCSSPropertyValue('--accent-main'),
        'text-halo-color': getCSSPropertyValue('--white'),
        'text-halo-width': 2,
      },
    });
  });
};

const setVisible = (map: maplibregl.Map, id: string, visible: boolean) =>
  map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');

export const applyBasemapOptions = (
  map: maplibregl.Map,
  provider: MapProviderKey,
  options: BasemapOptions
) => {
  addMissingLabels(map, provider);

  for (const overlay of OVERLAYS) {
    overlay.parts.forEach((_, index) => {
      const id = `${overlay.id}-${index}`;
      if (!map.getLayer(id)) return;
      setVisible(map, id, options[overlay.option]);
    });
  }

  for (const layer of map.getStyle().layers) {
    const sourceLayer = sourceLayerOf(layer) ?? '';

    // stop and station icons crowd the map; car parks are the only signs we keep
    if (layer.type === 'symbol' && /transit/.test(layer.id)) {
      setVisible(map, layer.id, false);
    } else if (layer.id.startsWith(PARKING)) {
      setVisible(map, layer.id, options.parking);
    } else if (layer.id.startsWith(BUILDINGS)) {
      setVisible(map, layer.id, options.buildings);
    } else if (HOUSE_NUMBER_LAYERS.has(sourceLayer)) {
      map.setLayerZoomRange(
        layer.id,
        Math.min(layer.minzoom ?? 0, HOUSE_NUMBERS_FROM),
        layer.maxzoom ?? 24
      );
      setVisible(map, layer.id, options.houseNumbers);
    } else if (PLACE_LAYERS.has(sourceLayer)) {
      setVisible(map, layer.id, options.places);
    } else if (STREET_NAME_LAYERS.has(sourceLayer) && layer.type === 'symbol') {
      map.setLayerZoomRange(
        layer.id,
        Math.min(layer.minzoom ?? 0, STREET_NAMES_FROM),
        layer.maxzoom ?? 24
      );
      setVisible(map, layer.id, options.streetNames);
    }
  }
};
