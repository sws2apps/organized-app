import * as maplibregl from 'maplibre-gl';
import { getCSSPropertyValue } from '@utils/common';
import { MAP_PROVIDERS, MapProviderKey } from './constants';

export type BasemapOptions = { houseNumbers: boolean; places: boolean };

// the tile layers that carry them, in the OpenMapTiles and Shortbread schemas
const HOUSE_NUMBER_LAYERS = new Set(['housenumber', 'addresses']);
const PLACE_LAYERS = new Set(['poi', 'pois']);

const HOUSE_NUMBERS = 'basemap-house-numbers';
const PLACES = 'basemap-places';

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
    label(HOUSE_NUMBERS, 'housenumber', 17, ['get', 'housenumber']);
  }

  if (!drawn(PLACE_LAYERS)) {
    label(PLACES, 'poi', 16, [
      'coalesce',
      ['get', 'name:latin'],
      ['get', 'name'],
    ]);
  }
};

export const applyBasemapOptions = (
  map: maplibregl.Map,
  provider: MapProviderKey,
  options: BasemapOptions
) => {
  addMissingLabels(map, provider);

  for (const layer of map.getStyle().layers) {
    const sourceLayer = sourceLayerOf(layer) ?? '';

    let visible: boolean;
    if (HOUSE_NUMBER_LAYERS.has(sourceLayer)) visible = options.houseNumbers;
    else if (PLACE_LAYERS.has(sourceLayer)) visible = options.places;
    else continue;

    map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
  }
};
