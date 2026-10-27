import * as maplibregl from 'maplibre-gl';
import { getCSSPropertyValue } from '@utils/common';
import {
  MAP_PROVIDERS,
  MapProviderKey,
} from '@features/territories/map/constants';

// place icons grouped by their OpenMapTiles class, so a congregation keeps only the useful ones
export const PLACE_TYPES = {
  shops: {
    label: 'tr_territoryShops',
    classes: [
      'shop',
      'grocery',
      'alcohol_shop',
      'clothing_store',
      'bakery',
      'hardware',
      'furniture',
      'florist',
      'jewelry',
      'mobile_phone',
      'books',
      'laundry',
    ],
  },
  food: {
    label: 'tr_territoryFoodAndDrink',
    classes: ['restaurant', 'fast_food', 'cafe', 'bar', 'beer', 'ice_cream'],
  },
  schools: {
    label: 'tr_territorySchools',
    classes: ['school', 'college', 'kindergarten', 'library'],
  },
  worship: {
    label: 'tr_territoryPlacesOfWorship',
    classes: ['place_of_worship'],
  },
  health: {
    label: 'tr_territoryHealth',
    classes: ['hospital', 'pharmacy', 'doctors', 'dentist'],
  },
  services: {
    label: 'tr_territoryPublicServices',
    classes: ['town_hall', 'post', 'police', 'fire_station', 'bank', 'atm'],
  },
  leisure: {
    label: 'tr_territoryLeisure',
    classes: [
      'park',
      'playground',
      'stadium',
      'swimming',
      'pitch',
      'zoo',
      'theatre',
      'cinema',
      'museum',
      'attraction',
      'castle',
      'monument',
    ],
  },
  // bins, recycling, fuel, charging and everything else without a group
  // every place outside the groups above: recycling points, toilets, bins and the like
  other: {
    label: 'tr_territoryEverythingElseLikeRecyclingAndToilets',
    classes: [] as string[],
  },
} as const;

export type PlaceType = keyof typeof PLACE_TYPES;

export type LayerSwitch = Exclude<keyof BasemapOptions, 'placeTypes'>;

export type BasemapOptions = {
  houseNumbers: boolean;
  places: boolean;
  green: boolean;
  water: boolean;
  buildings: boolean;
  streetNames: boolean;
  parking: boolean;
  placeTypes: PlaceType[];
};

export const DEFAULT_BASEMAP: BasemapOptions = {
  houseNumbers: true,
  places: true,
  green: true,
  water: true,
  buildings: true,
  streetNames: true,
  parking: true,
  placeTypes: [
    'shops',
    'food',
    'schools',
    'worship',
    'health',
    'services',
    'leisure',
  ],
};

// tinted overlays for both tile schemas; a source layer a provider lacks simply draws nothing
type Overlay = {
  id: string;
  option: 'green';
  color: string;
  opacity: number;
  parts: { layer: string; filter?: maplibregl.FilterSpecification }[];
};

const OVERLAYS: Overlay[] = [
  {
    id: 'basemap-green',
    option: 'green',
    // a muted sage, so parks stay quieter than the green territory borders
    color: '#8FAE8B',
    opacity: 0.16,
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
];

// water is tinted in the style's own layers: a translucent layer on top drew twice
// where a tile's water polygons overlap, which showed as darker seams on open sea
const WATER_LAYERS = new Set(['water', 'water_polygons', 'ocean']);
const WATER_TINT = '#2196F3';
const WATER_TINT_AMOUNT = 0.25;

// street names are what a territory map is read by: bigger when close in, repeated
// along long streets, in the theme's text colour with a halo
const STREET_NAME_SIZE: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  11,
  11,
  13,
  12,
  15,
  13,
  18,
  16,
];
const STREET_NAME_SPACING: maplibregl.ExpressionSpecification = [
  'step',
  ['zoom'],
  180,
  15,
  150,
  16,
  130,
];

// OpenFreeMap's dark style draws its streets almost as dark as the ground around them
const DARK_ROADS: Record<string, string> = {
  highway_path: '#2c2c2c',
  highway_minor: '#343434',
  highway_major_casing: 'rgba(120,120,120,0.8)',
  highway_major_inner: '#3c3c3c',
  highway_motorway_casing: 'rgba(120,120,120,0.8)',
  highway_motorway_inner: '#3c3c3c',
};

// the tile layers that carry them, in the OpenMapTiles and Shortbread schemas
const HOUSE_NUMBER_LAYERS = new Set(['housenumber', 'addresses']);
const PLACE_LAYERS = new Set(['poi', 'pois']);

const STREET_NAME_LAYERS = new Set(['transportation_name', 'street_labels']);

export const isHouseNumber = (layer: maplibregl.LayerSpecification) =>
  layer.type === 'symbol' &&
  HOUSE_NUMBER_LAYERS.has(sourceLayerOf(layer) ?? '');

export const isBuildingOutline = (layer: maplibregl.LayerSpecification) =>
  layer.id.startsWith(BUILDINGS);

export const isStreetName = (layer: maplibregl.LayerSpecification) =>
  layer.type === 'symbol' && STREET_NAME_LAYERS.has(sourceLayerOf(layer) ?? '');

const HOUSE_NUMBERS = 'basemap-house-numbers';
const PLACES = 'basemap-places';
const PARKING = 'basemap-parking';
const BUILDINGS = 'basemap-buildings';

// Offer names at wider views whenever the source tiles contain them.
const STREET_NAMES_FROM = 11;

// the tiles carry both from zoom 14, so big territories can show them before street level
const HOUSE_NUMBERS_FROM = 15;
const PARKING_FROM = 14;

const sourceLayerOf = (layer: maplibregl.LayerSpecification) =>
  'source-layer' in layer ? layer['source-layer'] : undefined;

// the two schemas share no layer names, so a style's own layers tell which one its tiles carry
const SCHEMAS = [
  new Set([
    'park',
    'landcover',
    'water',
    'building',
    'housenumber',
    'poi',
    'transportation',
    'transportation_name',
  ]),
  new Set([
    'land',
    'water_polygons',
    'buildings',
    'addresses',
    'pois',
    'streets',
    'street_labels',
  ]),
];

// a layer on a source layer the tiles don't have only logs an error on every load
const tileLayers = (map: maplibregl.Map, source: string) => {
  const listed = map.getSource(source)?.vectorLayerIds;
  if (listed?.length) return new Set(listed);

  const used = map.getStyle().layers.map((layer) => sourceLayerOf(layer) ?? '');

  return SCHEMAS.find((schema) => used.some((layer) => schema.has(layer)));
};

// OpenFreeMap's light style leaves out the house numbers and places its tiles carry
const addMissingLabels = (map: maplibregl.Map, provider: MapProviderKey) => {
  const style = map.getStyle();

  const drawn = (layers: Set<string>) =>
    style.layers.some((layer) => layers.has(sourceLayerOf(layer) ?? ''));

  const source = Object.entries(style.sources).find(
    ([, value]) => value.type === 'vector'
  )?.[0];
  if (!source) return;

  const known = tileLayers(map, source);
  const has = (sourceLayer: string) => !known || known.has(sourceLayer);

  // labels are placed from the top layer down, so ours go under the street
  // names and only take the room the names leave
  const beforeNames = style.layers.find(
    (layer) =>
      layer.type === 'symbol' &&
      STREET_NAME_LAYERS.has(sourceLayerOf(layer) ?? '')
  )?.id;

  const label = (
    id: string,
    sourceLayer: string,
    minzoom: number,
    text: maplibregl.ExpressionSpecification
  ) =>
    map.addLayer(
      {
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
      },
      beforeNames
    );

  if (!drawn(HOUSE_NUMBER_LAYERS) && has('housenumber')) {
    label(HOUSE_NUMBERS, 'housenumber', HOUSE_NUMBERS_FROM, [
      'get',
      'housenumber',
    ]);
  }

  for (const overlay of OVERLAYS) {
    overlay.parts.forEach((part, index) => {
      const id = `${overlay.id}-${index}`;
      if (map.getLayer(id) || !has(part.layer)) return;

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

  if (!drawn(PLACE_LAYERS) && has('poi')) {
    label(PLACES, 'poi', 16, [
      'coalesce',
      ['get', 'name:latin'],
      ['get', 'name'],
    ]);
  }

  // outlines make each building countable at street level
  for (const [index, layer] of ['building', 'buildings'].entries()) {
    const id = `${BUILDINGS}-${index}`;
    if (map.getLayer(id) || !has(layer)) continue;

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
    if (map.getLayer(id) || !has(layer)) return;

    map.addLayer(
      {
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
      },
      beforeNames
    );
  });

  for (const [id, color] of Object.entries(DARK_ROADS)) {
    if (map.getLayer(id)) map.setPaintProperty(id, 'line-color', color);
  }
};

const isWaterTint = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value[0] === 'interpolate' && value[6] === WATER_TINT;

// the tint is mixed into the layer's own colour, so it can be taken off again by
// reading it back; a colour that changes with zoom can't be mixed, since zoom has
// to stay at the top of a property
const tintWater = (map: maplibregl.Map, id: string, tinted: boolean) => {
  const current = map.getPaintProperty(id, 'fill-color');
  const original = isWaterTint(current) ? current[4] : current;
  if (typeof original !== 'string') return;

  map.setPaintProperty(
    id,
    'fill-color',
    tinted
      ? [
          'interpolate',
          ['linear'],
          WATER_TINT_AMOUNT,
          0,
          original,
          1,
          WATER_TINT,
        ]
      : original
  );
};

// every name and number goes above the fills, borders and drawings, as on
// the printed card; symbols keep their order, so territory numbers stay on top
export const labelsAbove = (map: maplibregl.Map) => {
  for (const layer of map.getStyle().layers) {
    if (layer.type === 'symbol') map.moveLayer(layer.id);
  }
};

// while borders are drawn, they matter more than the names: the basemap's
// labels go back under our layers, starting at `before`
export const labelsBelow = (map: maplibregl.Map, before: string) => {
  if (!map.getLayer(before)) return;
  for (const layer of map.getStyle().layers) {
    if (layer.type === 'symbol' && sourceLayerOf(layer)) {
      map.moveLayer(layer.id, before);
    }
  }
};

// shields keep their look; only the layers that write the street's name change
export const styleStreetName = (
  map: maplibregl.Map,
  layer: maplibregl.LayerSpecification
) => {
  const id = layer.id;
  const field = map.getLayoutProperty(id, 'text-field');
  if (!JSON.stringify(field)?.includes('name')) return;
  map.setLayerZoomRange(
    id,
    Math.min(layer.minzoom ?? 0, STREET_NAMES_FROM),
    layer.maxzoom ?? 24
  );

  map.setLayoutProperty(id, 'text-size', STREET_NAME_SIZE);
  map.setLayoutProperty(id, 'symbol-spacing', STREET_NAME_SPACING);
  map.setLayoutProperty(id, 'text-max-angle', 60);
  map.setLayoutProperty(id, 'text-padding', 1);
  map.setLayoutProperty(id, 'text-allow-overlap', false);
  map.setLayoutProperty(id, 'text-ignore-placement', false);
  map.setPaintProperty(id, 'text-opacity', 1);
  map.setLayoutProperty(id, 'text-transform', 'none');
  map.setPaintProperty(id, 'text-color', getCSSPropertyValue('--grey-400'));
  map.setPaintProperty(id, 'text-halo-color', getCSSPropertyValue('--white'));
  map.setPaintProperty(id, 'text-halo-width', 1.5);
  map.setPaintProperty(id, 'text-halo-blur', 0.5);
  // Names take collision priority over decorative place labels, without overlaps.
  map.moveLayer(id);
};

// older styles still use the legacy filter syntax, which can't be combined with an expression
const isLegacyFilter = (filter: unknown): boolean => {
  if (!Array.isArray(filter)) return false;
  const [op, ...rest] = filter;
  if (op === 'all' || op === 'any' || op === 'none') {
    return rest.some(isLegacyFilter);
  }
  return typeof rest[0] === 'string' && op !== 'literal' && op !== 'get';
};

const KNOWN_CLASSES = Object.values(PLACE_TYPES).flatMap(
  (type) => type.classes
);

const placeTypeFilter = (
  types: PlaceType[]
): maplibregl.ExpressionSpecification => {
  const classes = types.flatMap((type) => PLACE_TYPES[type].classes);

  const inGroups: maplibregl.ExpressionSpecification = [
    'in',
    ['get', 'class'],
    ['literal', classes],
  ];
  const ungrouped: maplibregl.ExpressionSpecification = [
    '!',
    ['in', ['get', 'class'], ['literal', KNOWN_CLASSES]],
  ];

  return types.includes('other') ? ['any', inGroups, ungrouped] : inGroups;
};

// each map remembers the filters its style came with, so the type filter never stacks
const styleFilters = new WeakMap<
  maplibregl.Map,
  Map<string, maplibregl.FilterSpecification | undefined>
>();

const filterPlaces = (map: maplibregl.Map, id: string, types: PlaceType[]) => {
  const saved = styleFilters.get(map) ?? new Map();
  styleFilters.set(map, saved);

  if (!saved.has(id)) saved.set(id, map.getFilter(id) ?? undefined);
  const original = saved.get(id);

  if (isLegacyFilter(original)) return;

  const byType = placeTypeFilter(types);

  map.setFilter(
    id,
    original
      ? (['all', original, byType] as maplibregl.FilterSpecification)
      : byType
  );
};

const setVisible = (map: maplibregl.Map, id: string, visible: boolean) =>
  map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');

// the style's own place icons crowd a territory map
export const hideStylePlaces = (map: maplibregl.Map) => {
  for (const layer of map.getStyle()?.layers ?? []) {
    if (/^poi/i.test(layer.id)) setVisible(map, layer.id, false);
  }
};

const applyLayerOptions = (
  map: maplibregl.Map,
  layer: maplibregl.LayerSpecification,
  options: BasemapOptions
) => {
  const sourceLayer = sourceLayerOf(layer) ?? '';

  // stop and station icons crowd the map; car parks are the only signs we keep.
  // 3D buildings draw above every flat layer, so they'd poke through the outside fade
  if (
    (layer.type === 'symbol' && /transit/.test(layer.id)) ||
    layer.type === 'fill-extrusion'
  ) {
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
    if (sourceLayer === 'poi' && layer.type === 'symbol') {
      filterPlaces(map, layer.id, options.placeTypes);
    }
  } else if (STREET_NAME_LAYERS.has(sourceLayer) && layer.type === 'symbol') {
    setVisible(map, layer.id, options.streetNames);
    styleStreetName(map, layer);
  } else if (WATER_LAYERS.has(sourceLayer) && layer.type === 'fill') {
    tintWater(map, layer.id, options.water);
  }
};

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
    applyLayerOptions(map, layer, options);
  }
};
