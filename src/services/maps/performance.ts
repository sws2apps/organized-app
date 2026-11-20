import * as maplibregl from 'maplibre-gl';
import { isIOS } from '@utils/pwa';

/**
 * How much map a device can carry. `low` is an iPhone 8 or a 2 GB Android
 * phone: WebKit gives such a phone a small graphics budget and takes the map's
 * WebGL context away the moment it is exceeded.
 */
export type MapTier = 'low' | 'medium' | 'high';

const ORDER: MapTier[] = ['low', 'medium', 'high'];

const rank = (tier: MapTier) => ORDER.indexOf(tier);
const lower = (a: MapTier, b: MapTier) => (rank(a) <= rank(b) ? a : b);
const higher = (a: MapTier, b: MapTier) => (rank(a) >= rank(b) ? a : b);
const stepDown = (tier: MapTier) => ORDER[Math.max(0, rank(tier) - 1)];

type Detail = {
  /** Simplification of borders in tiles; more of it means fewer vertices. */
  tolerance: number;
  /** Tile edge buffer in pixels, so fewer features are drawn twice. */
  buffer: number;
  /** Zoom levels the captions wait beyond their usual start. */
  captionDelay: number;
  /** The zoom from which drawn lines and shapes show; the overview stays clean. */
  drawingZoom: number;
  /** Past this zoom the tiles are stretched, not rebuilt: coordinates stay small. */
  sourceMaxZoom: number;
  /** A dashed line is cut into many pieces, for borders that span the city. */
  dashedBorder: boolean;
  /** Notes shown at once. */
  maxMarkers: number;
  /** Zoom levels the notes wait beyond their usual start. */
  markerDelay: number;
  /** Line joins: round eliminates miter spikes caused by micro-segments on weak GPUs. */
  lineJoin: 'round' | 'miter';
  /** Strips duplicate consecutive coordinates to prevent zero-length vector division on older devices. */
  sanitizeGeometry: boolean;
  /** Avoids unrolling 49-stop shader interpolation loops on low-tier mobile GPUs. */
  simpleOpacityShader: boolean;
};

const DETAILS: Record<MapTier, Detail> = {
  low: {
    tolerance: 1.5,
    buffer: 64,
    captionDelay: 2,
    drawingZoom: 14,
    sourceMaxZoom: 15,
    dashedBorder: false,
    maxMarkers: 40,
    markerDelay: 1.5,
    lineJoin: 'round',
    sanitizeGeometry: true,
    simpleOpacityShader: true,
  },
  medium: {
    tolerance: 0.8,
    buffer: 96,
    captionDelay: 1,
    drawingZoom: 13,
    sourceMaxZoom: 16,
    dashedBorder: true,
    maxMarkers: 120,
    markerDelay: 0.5,
    lineJoin: 'round',
    sanitizeGeometry: true,
    simpleOpacityShader: false,
  },
  high: {
    tolerance: 0.375,
    buffer: 128,
    captionDelay: 0,
    drawingZoom: 0,
    sourceMaxZoom: 18,
    dashedBorder: true,
    maxMarkers: Infinity,
    markerDelay: 0,
    lineJoin: 'miter',
    sanitizeGeometry: false,
    simpleOpacityShader: false,
  },
};

/** How much of the overview's detail this device draws at once. */
export const mapDetail = (): Detail => DETAILS[mapTier()];

type Profile = {
  /** Canvas resolution; memory grows with its square. */
  pixelRatio: number;
  maxTileCacheSize: number;
  maxTileCacheZoomLevels: number;
  /** Tiles downloaded and decoded at once. */
  parallelRequests: number;
  /** Tile decoding threads, each with its own memory; unset keeps MapLibre's. */
  workers?: number;
  /** A tilted map shows far more tiles towards the horizon. */
  maxPitch: number;
};

const PROFILES: Record<MapTier, Profile> = {
  low: {
    pixelRatio: 1,
    maxTileCacheSize: 24,
    maxTileCacheZoomLevels: 2,
    parallelRequests: 4,
    workers: 1,
    maxPitch: 0,
  },
  medium: {
    pixelRatio: 1.5,
    maxTileCacheSize: 40,
    maxTileCacheZoomLevels: 3,
    parallelRequests: 8,
    workers: 2,
    maxPitch: 60,
  },
  high: {
    pixelRatio: 2,
    maxTileCacheSize: 64,
    maxTileCacheZoomLevels: 5,
    parallelRequests: 16,
    maxPitch: 60,
  },
};

// RAM in GB, rounded down by the browser; only Chromium (Android's WebView too) tells it
const memoryTier = (): MapTier | undefined => {
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  if (!memory) return undefined;
  if (memory <= 2) return 'low';
  if (memory <= 4) return 'medium';
  return 'high';
};

/**
 * Safari keeps the RAM to itself, but the iOS version and the screen give the
 * phone away: iOS 16 is the last for the 2 GB iPhone 8 and 8 Plus (667 and 736
 * points tall), iOS 15 the last for the older ones. iPadOS asks for desktop
 * pages without a version, so iPads are left to the other checks.
 */
const iosTier = (): MapTier | undefined => {
  if (!isIOS()) return undefined;

  const major = Number(/OS (\d+)_/.exec(navigator.userAgent)?.[1]);
  if (!major) return undefined;

  const longSide = Math.max(window.screen.width, window.screen.height);
  const homeButton = longSide <= 736;

  if (major <= 15) return 'low';
  if (major === 16) return homeButton ? 'low' : 'medium';
  // an iPhone SE of the 2nd or 3rd generation: 3 or 4 GB
  return homeButton ? 'medium' : 'high';
};

// many cores say little about memory, so only few of them count
const coreTier = (): MapTier | undefined => {
  const cores = navigator.hardwareConcurrency;

  if (!cores) return undefined;
  if (cores <= 2) return 'low';
  if (cores <= 4) return 'medium';
  return undefined;
};

const PROBE_SIZE = 150_000;
// about 2 ms on a recent laptop, 5 ms on an iPhone 8, 10+ ms on a budget phone
const PROBE_FAST_MS = 4;
const PROBE_SLOW_MS = 9;

const probe = () => {
  const values = new Float64Array(PROBE_SIZE);
  let sum = 0;

  for (let i = 0; i < PROBE_SIZE; i++) {
    values[i] = Math.sqrt(i * 1.0001) * Math.sin(i);
  }
  for (let i = 0; i < PROBE_SIZE; i++) {
    sum += values[i] * values[(i * 7) % PROBE_SIZE];
  }

  return sum;
};

// a short, fixed piece of work: the middle of three runs, after one to warm up
const cpuTier = (): MapTier => {
  // the sums are checked, so the engine can't drop the work as unused
  let total = probe();

  const runs = [0, 1, 2]
    .map(() => {
      const start = performance.now();
      total += probe();
      return performance.now() - start;
    })
    .sort((a, b) => a - b);

  if (!Number.isFinite(total)) return 'medium';
  if (runs[1] <= PROBE_FAST_MS) return 'high';
  if (runs[1] <= PROBE_SLOW_MS) return 'medium';
  return 'low';
};

let detected: MapTier | undefined;
// steps taken down while the app runs, after a lost context or slow frames
let downgrades = 0;

const detect = (): MapTier => {
  // Safari may round the core count, so on iOS the model check decides alone
  const hardware = [memoryTier(), iosTier(), isIOS() ? undefined : coreTier()]
    .filter((tier): tier is MapTier => tier !== undefined)
    .reduce<
      MapTier | undefined
    >((worst, tier) => (worst ? lower(worst, tier) : tier), undefined);

  const cpu = cpuTier();

  // a busy moment can make the probe slow, so it takes at most one step off
  // what the hardware says; with nothing known about the hardware it decides
  return hardware ? lower(hardware, higher(cpu, stepDown(hardware))) : cpu;
};

/** The tier maps open with now; measured once, lower after trouble. */
export const mapTier = (): MapTier => {
  detected ??= detect();

  let tier = detected;
  for (let step = 0; step < downgrades; step++) tier = stepDown(tier);

  return tier;
};

/** One step lighter for every map from now on, until the app restarts. */
export const downgradeMapTier = () => {
  if (mapTier() !== 'low') downgrades += 1;
};

let workersSet = false;

// both are shared by every map; the workers only before the first one starts
const configureLibrary = (profile: Profile) => {
  maplibregl.setMaxParallelImageRequests(profile.parallelRequests);

  if (workersSet) return;
  workersSet = true;

  if (profile.workers) {
    maplibregl.setWorkerCount(
      Math.min(profile.workers, maplibregl.getWorkerCount())
    );
  }
};

const pixelRatioOf = (profile: Profile) =>
  Math.min(window.devicePixelRatio || 1, profile.pixelRatio);

/** Options for a new map, sized to what this device can carry. */
export const mapPerformanceOptions = () => {
  const tier = mapTier();
  const profile = PROFILES[tier];

  configureLibrary(profile);

  return {
    pixelRatio: pixelRatioOf(profile),
    maxTileCacheSize: profile.maxTileCacheSize,
    maxTileCacheZoomLevels: profile.maxTileCacheZoomLevels,
    maxPitch: profile.maxPitch,
    // old and new tiles are never held together for a cross-fade
    fadeDuration: 0,
    // an expired tile stays until the map moves, instead of downloading again
    refreshExpiredTiles: tier !== 'low',
    canvasContextAttributes: {
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power' as const,
    },
  } satisfies Partial<maplibregl.MapOptions>;
};

/** Brings a running map to the current tier, without starting it again. */
export const applyMapTier = (map: maplibregl.Map) => {
  const profile = PROFILES[mapTier()];

  configureLibrary(profile);

  if (map.getPixelRatio() !== pixelRatioOf(profile)) {
    map.setPixelRatio(pixelRatioOf(profile));
  }
  if (map.getPitch() > profile.maxPitch) map.setPitch(profile.maxPitch);
  map.setMaxPitch(profile.maxPitch);
};

// under 20 frames a second
const SLOW_FRAME_MS = 50;
// a pan or zoom shorter than this says nothing about the frame rate
const MIN_FRAMES = 20;
// one slow move can be a tile burst; three in a row are the device
const SLOW_MOVES = 3;

/**
 * Watches the frame rate while the user pans and zooms, and steps every map
 * down when it keeps stuttering. The canvas resolution changes in place, so
 * the map stays where it is.
 */
export const watchMapPerformance = (map: maplibregl.Map) => {
  const gaps: number[] = [];
  let last = 0;
  let slowMoves = 0;

  const onRender = () => {
    const now = performance.now();
    if (last) gaps.push(now - last);
    last = now;
  };

  map.on('movestart', () => {
    gaps.length = 0;
    last = 0;
    map.on('render', onRender);
  });

  map.on('moveend', () => {
    map.off('render', onRender);

    if (gaps.length < MIN_FRAMES || mapTier() === 'low') return;

    gaps.sort((a, b) => a - b);
    const median = gaps[gaps.length >> 1];

    slowMoves = median > SLOW_FRAME_MS ? slowMoves + 1 : 0;
    if (slowMoves < SLOW_MOVES) return;

    slowMoves = 0;
    downgradeMapTier();
    applyMapTier(map);
  });
};
