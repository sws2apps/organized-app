import { MAP_CENTER } from '../mockData';

/**
 * Basemaps that cost nothing and need no API key, so a congregation can open
 * the map without signing up anywhere. All of them serve vector tiles, which
 * keeps the download small and lets the style follow the app theme.
 *
 * - carto: light and dark siblings of the same design, attribution required
 * - openfreemap: unlimited and free forever, fully self-hostable
 * - versatiles: community hosted, ships a dark style of its own
 * - osm: raster fallback, light only, heavy usage discouraged
 */
export const MAP_PROVIDERS = {
  carto: {
    name: 'CARTO',
    light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    lightPlain:
      'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
    darkPlain:
      'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
  },
  openfreemap: {
    name: 'OpenFreeMap',
    light: 'https://tiles.openfreemap.org/styles/positron',
    dark: 'https://tiles.openfreemap.org/styles/liberty',
    lightPlain: 'https://tiles.openfreemap.org/styles/positron',
    darkPlain: 'https://tiles.openfreemap.org/styles/liberty',
  },
  versatiles: {
    name: 'VersaTiles',
    light: 'https://tiles.versatiles.org/assets/styles/graybeard/style.json',
    dark: 'https://tiles.versatiles.org/assets/styles/eclipse/style.json',
    lightPlain:
      'https://tiles.versatiles.org/assets/styles/graybeard/style.json',
    darkPlain: 'https://tiles.versatiles.org/assets/styles/eclipse/style.json',
  },
} as const;

export type MapProviderKey = keyof typeof MAP_PROVIDERS;

export type MapView = 'map' | 'plain';

export const MAP_PROVIDER = MAP_PROVIDERS.carto;

export const styleUrl = (
  provider: MapProviderKey,
  isDark: boolean,
  view: MapView
) => {
  const styles = MAP_PROVIDERS[provider];

  if (view === 'plain') return isDark ? styles.darkPlain : styles.lightPlain;

  return isDark ? styles.dark : styles.light;
};

export const DEFAULT_CENTER = MAP_CENTER;
export const DEFAULT_ZOOM = 13;

export const SOURCE_ID = 'territories';
export const FILL_LAYER = 'territories-fill';
export const LINE_LAYER = 'territories-line';
export const LABEL_LAYER = 'territories-label';

export const LINES_SOURCE = 'territory-lines';
export const LINE_SOLID_LAYER = 'territory-lines-solid';
export const LINE_DASHED_LAYER = 'territory-lines-dashed';

export const CONGREGATION_SOURCE = 'congregation-boundary';
export const CONGREGATION_FILL_LAYER = 'congregation-boundary-fill';
export const CONGREGATION_LINE_LAYER = 'congregation-boundary-line';

export const MARKERS_SOURCE = 'territory-markers';
export const MARKER_PIN_LAYER = 'territory-markers-pin';
export const MARKER_TEXT_LAYER = 'territory-markers-text';
