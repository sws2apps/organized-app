import * as maplibregl from 'maplibre-gl';
import { Territory } from '@definition/territory';
import { MAP_COLORS } from './constants';
import { lineCollection, shapeCollection } from './helpers';

export const addDrawingLayers = (
  map: maplibregl.Map,
  territories: Territory[],
  prefix = 'drawing'
) => {
  map.addSource(`${prefix}-shapes`, {
    type: 'geojson',
    data: shapeCollection(territories),
  });

  map.addSource(`${prefix}-lines`, {
    type: 'geojson',
    data: lineCollection(territories),
  });

  map.addLayer({
    id: `${prefix}-shapes-fill`,
    type: 'fill',
    source: `${prefix}-shapes`,
    filter: ['!=', ['get', 'fill'], ''],
    paint: { 'fill-color': ['get', 'fill'], 'fill-opacity': 0.35 },
  });

  map.addLayer({
    id: `${prefix}-shapes-line`,
    type: 'line',
    source: `${prefix}-shapes`,
    filter: ['!=', ['get', 'border'], ''],
    paint: { 'line-color': ['get', 'border'], 'line-width': 2.5 },
  });

  map.addLayer({
    id: `${prefix}-lines-solid`,
    type: 'line',
    source: `${prefix}-lines`,
    filter: ['==', ['get', 'style'], 'solid'],
    paint: { 'line-color': MAP_COLORS.blue, 'line-width': 3 },
  });

  map.addLayer({
    id: `${prefix}-lines-dashed`,
    type: 'line',
    source: `${prefix}-lines`,
    filter: ['==', ['get', 'style'], 'dashed'],
    paint: {
      'line-color': MAP_COLORS.green,
      'line-width': 3,
      'line-dasharray': [2, 2],
    },
  });
};

export const setDrawingData = (
  map: maplibregl.Map,
  territories: Territory[],
  prefix = 'drawing'
) => {
  (
    map.getSource(`${prefix}-shapes`) as maplibregl.GeoJSONSource | undefined
  )?.setData(shapeCollection(territories));

  (
    map.getSource(`${prefix}-lines`) as maplibregl.GeoJSONSource | undefined
  )?.setData(lineCollection(territories));
};

export const addTerritoryLayers = (
  map: maplibregl.Map,
  territory: Territory,
  fillOpacity: number
) => {
  map.addSource('territory-area', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [territory.boundary ?? []] },
    },
  });

  map.addLayer({
    id: 'territory-area-fill',
    type: 'fill',
    source: 'territory-area',
    paint: { 'fill-color': MAP_COLORS.blue, 'fill-opacity': fillOpacity },
  });

  map.addLayer({
    id: 'territory-area-line',
    type: 'line',
    source: 'territory-area',
    paint: { 'line-color': MAP_COLORS.blue, 'line-width': 3.5 },
  });

  addDrawingLayers(map, [territory], 'territory');
};
