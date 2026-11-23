import { atom } from 'jotai';
import { store } from '@states/index';
import type { RequestTransformFunction } from 'maplibre-gl';

export type OfflineRegion = {
  provider: string;
  bytes: number;
  tiles: number;
  date: string;
  bounds: [number, number, number, number];
};
export const offlineMapState = atom<{
  available: boolean;
  region?: OfflineRegion;
  done: number;
  total: number;
  busy: boolean;
  error?: string;
}>({ available: false, done: 0, total: 0, busy: false });
export type MapDownloads = {
  download: (
    bounds: OfflineRegion['bounds'],
    provider: string
  ) => Promise<void>;
  cancel: () => void;
  remove: () => Promise<void>;
};
let downloads: MapDownloads | undefined;
export const configureMapDownloads = (next: MapDownloads) => {
  downloads = next;
  store.set(offlineMapState, (value) => ({ ...value, available: true }));
};
export const mapDownloads = () => downloads;
export const mapRequest: RequestTransformFunction = (url) => ({
  url:
    downloads && url.startsWith('https://')
      ? `territory-map://${encodeURIComponent(url)}`
      : url,
});
