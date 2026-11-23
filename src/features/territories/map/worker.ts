import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// maplibre resolves its worker next to its own chunk, which the build never emits
setWorkerUrl(workerUrl);
