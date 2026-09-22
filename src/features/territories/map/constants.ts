import { MapColor, PinType } from '@definition/territory';
import { MAP_CENTER } from '../mockData';

/**
 * Basemaps that cost nothing and need no API key, so a congregation can open
 * the map without signing up anywhere. All of them serve vector tiles, which
 * keeps the download small and lets the style follow the app theme.
 *
 * - carto: light and dark siblings of the same design, attribution required
 * - openfreemap: unlimited and free forever, fully self-hostable
 * - versatiles: community hosted, ships a dark style of its own
 */
export const MAP_PROVIDERS = {
  carto: {
    name: 'CARTO',
    light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    // a label can only use fonts the provider's glyph server has
    fonts: { regular: ['Open Sans Regular'], bold: ['Open Sans Bold'] },
  },
  openfreemap: {
    name: 'OpenFreeMap',
    light: 'https://tiles.openfreemap.org/styles/positron',
    dark: 'https://tiles.openfreemap.org/styles/liberty',
    fonts: { regular: ['Noto Sans Regular'], bold: ['Noto Sans Bold'] },
  },
  versatiles: {
    name: 'VersaTiles',
    light: 'https://tiles.versatiles.org/assets/styles/graybeard/style.json',
    dark: 'https://tiles.versatiles.org/assets/styles/eclipse/style.json',
    fonts: { regular: ['noto_sans_regular'], bold: ['noto_sans_bold'] },
  },
} as const;

export type MapProviderKey = keyof typeof MAP_PROVIDERS;

export const MAP_PROVIDER = MAP_PROVIDERS.carto;

export const styleUrl = (provider: MapProviderKey, isDark: boolean) => {
  const styles = MAP_PROVIDERS[provider];

  return isDark ? styles.dark : styles.light;
};

export const DEFAULT_CENTER = MAP_CENTER;
export const DEFAULT_ZOOM = 13;

export const SOURCE_ID = 'territories';
export const FILL_LAYER = 'territories-fill';
export const LINE_LAYER = 'territories-line';
export const LABEL_LAYER = 'territories-label';
export const LABELS_SOURCE = 'territories-labels';

export const CONGREGATION_SOURCE = 'congregation-boundary';
export const CONGREGATION_FILL_LAYER = 'congregation-boundary-fill';
export const CONGREGATION_LINE_LAYER = 'congregation-boundary-line';

// drawings get printed, so they keep a fixed palette instead of the theme
export const MAP_COLORS: Record<MapColor, string> = {
  red: '#D93A3A',
  blue: '#3B6FD8',
  green: '#3FA34D',
  orange: '#E8912D',
  purple: '#8E5BD6',
  black: '#222222',
};

export const MAP_COLOR_LABEL: Record<MapColor, string> = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  orange: 'Orange',
  purple: 'Purple',
  black: 'Black',
};

export const PIN_TYPES: { id: PinType; label: string }[] = [
  { id: 'normal', label: 'Normal pin' },
  { id: 'parking', label: 'Parking' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'transport', label: 'Transportation stop' },
  { id: 'shop', label: 'Shop' },
  { id: 'nature', label: 'Nature' },
  { id: 'gas', label: 'Gas station' },
  { id: 'sight', label: 'Sight place' },
  { id: 'building', label: 'Known building' },
  { id: 'school', label: 'School' },
  { id: 'cart', label: 'Cart point' },
];

export const pinLabel = (type?: PinType) =>
  PIN_TYPES.find((item) => item.id === type)?.label ?? 'Pin';
