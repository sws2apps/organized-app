import * as maplibregl from 'maplibre-gl';
import { Territory } from '@definition/territory';
import { MAP_PROVIDER } from './constants';
import { boundaryBounds } from './helpers';
import { addTerritoryLayers } from './layers';
import { paintMarkers } from './markers';

// the same 1.74 ratio the card gives the picture, so it fills the frame
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
      // the card is printed on white paper, so always the light basemap
      style: MAP_PROVIDER.light,
      bounds: [west, south, east, north],
      fitBoundsOptions: { padding: 48 },
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    let done = false;

    const cleanup = (result?: string) => {
      if (done) return;
      done = true;

      window.clearTimeout(timeout);
      map.remove();
      container.remove();
      resolve(result);
    };

    const timeout = window.setTimeout(() => cleanup(undefined), 12000);

    let styled = false;

    map.on('style.load', () => {
      styled = true;
      addTerritoryLayers(map, territory, 0);
    });

    map.once('idle', () => {
      const canvas = document.createElement('canvas');
      canvas.width = map.getCanvas().width;
      canvas.height = map.getCanvas().height;
      canvas.getContext('2d')?.drawImage(map.getCanvas(), 0, 0);

      // the card shrinks the picture to about half, so the chips are drawn larger
      paintMarkers(canvas, map, territory.mapMarkers ?? [], 2);

      cleanup(canvas.toDataURL('image/png'));
    });

    // a missing tile still leaves a usable picture; only a basemap that never loads fails
    map.on('error', () => {
      if (!styled) cleanup(undefined);
    });
  });
