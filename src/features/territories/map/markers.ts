import { createElement } from 'react';
import * as maplibregl from 'maplibre-gl';
import { createRoot, Root } from 'react-dom/client';
import { TerritoryMapMarker } from '@definition/territory';
import { chip } from './helpers';
import MarkerChip from './marker_chip';

export type MarkerRegistry = Map<
  string,
  { marker: maplibregl.Marker; root: Root; item: TerritoryMapMarker }
>;

// labelled chips can't be drawn by a symbol layer, so they are DOM markers
export const syncMarkers = (
  map: maplibregl.Map,
  items: TerritoryMapMarker[],
  registry: MarkerRegistry
) => {
  const ids = new Set(items.map((item) => item.id));

  for (const [id, { marker, root }] of registry) {
    if (ids.has(id)) continue;

    marker.remove();
    setTimeout(() => root.unmount());
    registry.delete(id);
  }

  for (const item of items) {
    const entry = registry.get(item.id);

    if (entry) {
      if (entry.item === item) continue;

      entry.marker.setLngLat(item.position);
      entry.root.render(createElement(MarkerChip, { item }));
      entry.item = item;
      continue;
    }

    const element = document.createElement('div');
    const root = createRoot(element);

    root.render(createElement(MarkerChip, { item }));

    const marker = new maplibregl.Marker({ element })
      .setLngLat(item.position)
      .addTo(map);

    registry.set(item.id, { marker, root, item });
  }
};

// the printed card is a canvas snapshot without the DOM chips, so they are painted onto it
export const paintMarkers = (
  canvas: HTMLCanvasElement,
  map: maplibregl.Map,
  items: TerritoryMapMarker[],
  scale = 1
) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  const ratio = (canvas.width / map.getContainer().clientWidth) * scale;

  for (const item of items) {
    const { background, label } = chip(item);
    const point = map.project(item.position);
    const origin = canvas.width / map.getContainer().clientWidth;

    const size = (item.kind === 'text' ? 13 : 11) * ratio;
    context.font = `${item.kind === 'text' ? 600 : 500} ${size}px Inter, sans-serif`;

    const padX = 7 * ratio;
    const height = size + 8 * ratio;
    const width = context.measureText(label).width + padX * 2;

    const x = point.x * origin - width / 2;
    const y = point.y * origin - height / 2;

    context.fillStyle = background;
    context.beginPath();
    context.roundRect(x, y, width, height, 4 * ratio);
    context.fill();

    context.fillStyle = '#FFFFFF';
    context.textBaseline = 'middle';
    context.fillText(label, x + padX, y + height / 2);
  }
};
