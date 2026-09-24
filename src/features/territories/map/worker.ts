import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// maplibre finds its worker next to its own file, which a production bundle doesn't copy
setWorkerUrl(workerUrl);
