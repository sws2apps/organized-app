import * as maplibregl from 'maplibre-gl';
import { Territory } from '@definition/territory';
import { MAP_PROVIDER } from './constants';
import {
  boundaryBounds,
  lineCollection,
  markerCollection,
  statusColor,
} from './helpers';

const WIDTH = 1040;
const HEIGHT = 600;

/**
 * Renders the territory on an off-screen map and returns it as a PNG data URL.
 * Printing needs a picture, and the same drawing the congregation edits is the
 * only one that is guaranteed to be current.
 */
export const captureTerritoryMap = (territory: Territory) =>
  new Promise<string | undefined>((resolve) => {
    const boundary = territory.boundary;

    if (!boundary?.length) {
      resolve(undefined);
      return;
    }

    const container = document.createElement('div');
    container.style.cssText = `position:fixed;left:-10000px;top:0;width:${WIDTH}px;height:${HEIGHT}px`;
    document.body.appendChild(container);

    const [west, south, east, north] = boundaryBounds(boundary);

    const map = new maplibregl.Map({
      container,
      style: MAP_PROVIDER.light,
      bounds: [west, south, east, north],
      fitBoundsOptions: { padding: 48 },
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    const cleanup = (result?: string) => {
      map.remove();
      container.remove();
      resolve(result);
    };

    const timeout = window.setTimeout(() => cleanup(undefined), 12000);

    map.on('style.load', () => {
      const color = statusColor(territory);

      map.addSource('area', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [boundary] },
        },
      });

      map.addLayer({
        id: 'area-fill',
        type: 'fill',
        source: 'area',
        paint: { 'fill-color': color, 'fill-opacity': 0.18 },
      });

      map.addLayer({
        id: 'area-line',
        type: 'line',
        source: 'area',
        paint: { 'line-color': color, 'line-width': 3 },
      });

      map.addSource('notes', {
        type: 'geojson',
        data: lineCollection([territory]),
      });

      map.addLayer({
        id: 'notes-solid',
        type: 'line',
        source: 'notes',
        filter: ['==', ['get', 'style'], 'solid'],
        paint: { 'line-color': '#1c1c1c', 'line-width': 3 },
      });

      map.addLayer({
        id: 'notes-dashed',
        type: 'line',
        source: 'notes',
        filter: ['==', ['get', 'style'], 'dashed'],
        paint: {
          'line-color': '#1c1c1c',
          'line-width': 3,
          'line-dasharray': [2, 2],
        },
      });

      map.addSource('markers', {
        type: 'geojson',
        data: markerCollection([territory]),
      });

      map.addLayer({
        id: 'markers-pin',
        type: 'circle',
        source: 'markers',
        filter: ['==', ['get', 'kind'], 'pin'],
        paint: {
          'circle-radius': 7,
          'circle-color': '#E53935',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.addLayer({
        id: 'markers-text',
        type: 'symbol',
        source: 'markers',
        filter: ['==', ['get', 'kind'], 'text'],
        layout: {
          'text-field': ['get', 'text'],
          'text-size': 15,
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#1c1c1c',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
        },
      });
    });

    map.on('idle', () => {
      window.clearTimeout(timeout);
      cleanup(map.getCanvas().toDataURL('image/png'));
    });

    map.on('error', () => {
      window.clearTimeout(timeout);
      cleanup(undefined);
    });
  });
