import { createElement } from 'react';
import * as maplibregl from 'maplibre-gl';
import { createRoot, Root } from 'react-dom/client';
import { TerritoryMapMarker } from '@definition/territory';
import { chip } from '@features/territories/map/helpers';
import MarkerChip from '@features/territories/map/marker_chip';

export type MarkerRegistry = Map<
  string,
  {
    marker: maplibregl.Marker;
    root: Root;
    item: TerritoryMapMarker;
    selected: boolean;
  }
>;

// they help on one territory, not across all of them: under this zoom pins
// show as icons only and notes not at all, and further out nothing shows
export const MARKER_ICON_ZOOM = 14.5;
export const MARKER_FULL_ZOOM = 15.5;

const CSS = `
[data-marker-zoom='icon'] .territory-marker:not(.territory-marker--area) .territory-marker-label,
[data-marker-zoom='icon'] .territory-marker--text:not(.territory-marker--area),
[data-marker-zoom='none'] .territory-marker:not(.territory-marker--area) { display: none !important; }
`;

// the zoom at which a territory fills the view with a tenth of it to spare
export const frameZoom = (
  map: maplibregl.Map,
  boundary: [number, number][]
) => {
  const bounds = boundary.reduce(
    (box, point) => box.extend(point),
    new maplibregl.LngLatBounds(boundary[0], boundary[0])
  );
  const { clientWidth, clientHeight } = map.getContainer();
  const padding = Math.round(Math.min(clientWidth, clientHeight) * 0.1);
  return map.cameraForBounds(bounds, { padding })?.zoom ?? 0;
};

// a part's letter is for reading one territory as a whole: it shows once that
// territory fills the view, not while it is one of many
const frames = new WeakMap<HTMLElement, [number, number][]>();

const showFramed = (map: maplibregl.Map) => {
  const zoom = map.getZoom();
  for (const element of map
    .getContainer()
    .querySelectorAll<HTMLElement>('.maplibregl-marker')) {
    const boundary = frames.get(element);
    if (!boundary) continue;
    element.style.visibility =
      zoom >= frameZoom(map, boundary) - 0.05 ? '' : 'hidden';
  }
};

// while editing, the territory's own pins and notes show whole at any zoom:
// they are what is being edited
const showByZoom = (map: maplibregl.Map) => {
  const zoom = map.getZoom();
  const container = map.getContainer();
  let level = zoom >= MARKER_ICON_ZOOM ? 'icon' : 'none';
  if (container.dataset.editing || zoom >= MARKER_FULL_ZOOM) level = 'full';
  container.dataset.markerZoom = level;
};

const watched = new WeakSet<maplibregl.Map>();

const watchZoom = (map: maplibregl.Map) => {
  if (watched.has(map)) return;
  watched.add(map);

  if (!document.getElementById('territory-marker-css')) {
    const style = document.createElement('style');
    style.id = 'territory-marker-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  const update = () => showByZoom(map);
  update();
  map.on('zoom', update);
  map.on('zoom', () => showFramed(map));
  map.on('resize', () => showFramed(map));
};

// labelled chips can't be drawn by a symbol layer, so they are DOM markers
export const syncMarkers = (
  map: maplibregl.Map,
  items: TerritoryMapMarker[],
  registry: MarkerRegistry,
  selectedId?: string,
  // marker id -> the border of the territory a part's letter belongs to
  framedBy?: Map<string, [number, number][]>
) => {
  watchZoom(map);
  showByZoom(map);

  const ids = new Set(items.map((item) => item.id));

  for (const [id, { marker, root }] of registry) {
    if (ids.has(id)) continue;

    marker.remove();
    setTimeout(() => root.unmount());
    registry.delete(id);
  }

  for (const item of items) {
    const entry = registry.get(item.id);

    const selected = item.id === selectedId;

    if (entry) {
      if (entry.item === item && entry.selected === selected) continue;

      entry.marker.setLngLat(item.position);
      entry.root.render(createElement(MarkerChip, { item, selected }));
      entry.item = item;
      entry.selected = selected;
      continue;
    }

    const element = document.createElement('div');
    const root = createRoot(element);

    root.render(createElement(MarkerChip, { item, selected }));

    const marker = new maplibregl.Marker({ element })
      .setLngLat(item.position)
      .addTo(map);

    registry.set(item.id, { marker, root, item, selected });
  }

  for (const [id, { marker }] of registry) {
    const boundary = framedBy?.get(id);
    if (boundary?.length) frames.set(marker.getElement(), boundary);
    else frames.delete(marker.getElement());
  }
  showFramed(map);
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

    const size = 11 * ratio;
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
