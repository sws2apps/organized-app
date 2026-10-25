import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { JWLangLocaleState } from '@states/settings';
import * as maplibregl from 'maplibre-gl';
import { Image, Page, pdf } from '@react-pdf/renderer';
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { Button, Checkbox, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { Document } from '@views/components';
import { mapRequest } from '@services/maps/offline';
import { mapPerformanceOptions } from '@services/maps/performance';
import { exportFile } from '@services/files/export';
import { displaySnackNotification } from '@services/states/app';
import { MapColor, Territory, TerritoryBoundary } from '@definition/territory';
import {
  DEFAULT_PROVIDER,
  MAP_COLORS,
  MAP_EXPORT_PADDING,
  MAP_PROVIDER,
  MAP_PROVIDERS,
} from '@features/territories/map/constants';
import {
  applyBasemapOptions,
  DEFAULT_BASEMAP,
  labelsAbove,
} from '@features/territories/map/basemap';
import { boundaryBounds } from '@features/territories/map/helpers';

// ---- the whole congregation's map on paper, from A4 up to a wall poster ----

export type Format = 'portrait' | 'landscape' | 'square';

// in millimetres. A sheets share one shape, so one A2 picture prints on A4 up
// to A1: its numbers stay readable on A4 and bold on A1. The dots per inch
// keep it under ~9 million pixels, which every phone's graphics can hold; a
// metre square is seen from further away, so fewer dots still print sharp
const FORMATS: Record<
  Format,
  { width: number; height: number; dpi: number; line: number }
> = {
  square: { width: 1000, height: 1000, dpi: 75, line: 2.5 },
  portrait: { width: 420, height: 594, dpi: 150, line: 1.8 },
  landscape: { width: 594, height: 420, dpi: 150, line: 1.8 },
};

const TERRITORY_LINE = 1.4;
// the congregation's outline at least twice as thick as a territory's
const BORDER_LINE = TERRITORY_LINE * 2.5;

const FORMAT_LABEL: Record<Format, string> = {
  portrait: 'tr_portrait',
  landscape: 'tr_landscape',
  square: 'tr_territorySquare',
};

// the map is laid out at this scale, so street names stay a readable size on
// paper and a larger sheet shows more of the streets, not bigger letters
const PX_PER_MM = 4;
const POINTS_PER_MM = 72 / 25.4;

export type OverviewOptions = {
  format: Format;
  border: boolean;
  territories: boolean;
  numbers: boolean;
  colors: boolean;
};

const sizeOf = ({ format }: OverviewOptions) => FORMATS[format];

type Spot = [number, number];

const inside = ([x, y]: Spot, ring: Spot[]) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }
  return hit;
};

const edgeDistance = ([x, y]: Spot, ring: Spot[]) => {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[j];
    const [bx, by] = ring[i];
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(
      0,
      Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1))
    );
    best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return best;
};

// the roomiest point inside a shape (in screen pixels) and how far it is from
// the nearest edge: a coarse grid, then a finer one around the best cell
const roomiest = (ring: Spot[]) => {
  const xs = ring.map(([x]) => x);
  const ys = ring.map(([, y]) => y);
  let left = Math.min(...xs);
  let top = Math.min(...ys);
  let width = Math.max(...xs) - left;
  let height = Math.max(...ys) - top;
  let best = { point: [left + width / 2, top + height / 2] as Spot, room: 0 };
  for (let pass = 0; pass < 2; pass++) {
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      for (let k = 0; k <= steps; k++) {
        const point: Spot = [
          left + (width * i) / steps,
          top + (height * k) / steps,
        ];
        if (!inside(point, ring)) continue;
        const room = edgeDistance(point, ring);
        if (room > best.room) best = { point, room };
      }
    }
    width /= 6;
    height /= 6;
    left = best.point[0] - width / 2;
    top = best.point[1] - height / 2;
  }
  return best;
};

/** Renders the overview off screen as a JPEG data URL; partial when some of
 * the map didn't load. */
const styleOverviewLabels = (map: maplibregl.Map) => {
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue;
    // road numbers like B57 only crowd a territory map
    if (/shield/.test(layer.id)) {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      continue;
    }
    if (layer.layout?.['text-field'] === undefined) continue;
    map.setPaintProperty(layer.id, 'text-color', '#555555');
    map.setPaintProperty(layer.id, 'text-halo-color', '#FFFFFF');
  }
};

const captureOverview = (
  territories: Territory[],
  areas: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
  congregation: TerritoryBoundary | undefined,
  borderColor: MapColor,
  borderDashed: boolean,
  options: OverviewOptions
) =>
  new Promise<{ image: string; partial: boolean } | undefined>((resolve) => {
    const drawn = territories.filter((item) => item.boundary?.length);
    const border = options.border ? congregation : undefined;
    const extent = border?.length ? border : drawn.flatMap((t) => t.boundary!);
    if (!extent.length) return resolve(undefined);

    const paper = sizeOf(options);
    const width = Math.round(paper.width * PX_PER_MM);
    const height = Math.round(paper.height * PX_PER_MM);

    const container = document.createElement('div');
    container.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${height}px`;
    document.body.appendChild(container);

    // Keep the outermost boundaries away from the map edges in every orientation.
    const horizontalPadding = Math.round(width * MAP_EXPORT_PADDING);
    const verticalPadding = Math.round(height * MAP_EXPORT_PADDING);
    let map: maplibregl.Map;
    try {
      const tuned = mapPerformanceOptions();
      map = new maplibregl.Map({
        container,
        // paper is white, whatever the app's theme
        style: MAP_PROVIDER.light,
        bounds: boundaryBounds(extent),
        fitBoundsOptions: {
          padding: {
            top: verticalPadding,
            bottom: verticalPadding,
            left: horizontalPadding,
            right: horizontalPadding,
          },
        },
        interactive: false,
        transformRequest: mapRequest,
        attributionControl: false,
        ...tuned,
        pixelRatio: paper.dpi / (PX_PER_MM * 25.4),
        maxTileCacheSize: Math.min(64, tuned.maxTileCacheSize),
        canvasContextAttributes: {
          ...tuned.canvasContextAttributes,
          preserveDrawingBuffer: true,
          antialias: true,
        },
      });
    } catch {
      container.remove();
      return resolve(undefined);
    }

    let done = false;
    let styled = false;
    let partial = false;
    const finish = (capture = true) => {
      if (done) return;
      done = true;
      window.clearTimeout(timeout);
      let image: string | undefined;
      try {
        if (capture) image = map.getCanvas().toDataURL('image/jpeg', 0.92);
      } catch {
        image = undefined;
      } finally {
        map.remove();
        container.remove();
        resolve(image ? { image, partial } : undefined);
      }
    };
    // a big sheet loads many tiles; what has come by then still prints
    const timeout = window.setTimeout(() => {
      partial = true;
      finish(styled);
    }, 60000);

    map.on('style.load', () => {
      styled = true;
      applyBasemapOptions(map, DEFAULT_PROVIDER, DEFAULT_BASEMAP);

      styleOverviewLabels(map);

      if (options.territories) {
        map.addSource('print-territories', { type: 'geojson', data: areas });
        if (options.colors) {
          map.addLayer({
            id: 'print-fill',
            type: 'fill',
            source: 'print-territories',
            filter: ['to-boolean', ['get', 'filled']],
            paint: { 'fill-color': ['get', 'fill'], 'fill-opacity': 0.18 },
          });
        }
        map.addLayer({
          id: 'print-territories',
          type: 'line',
          source: 'print-territories',
          layout: { 'line-join': 'round' },
          paint: {
            'line-color': options.colors ? ['get', 'color'] : '#2E3E8F',
            'line-width': TERRITORY_LINE * paper.line,
          },
        });
      }

      if (border?.length) {
        map.addSource('print-border', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [border] },
          },
        });
        map.addLayer({
          id: 'print-border',
          type: 'line',
          source: 'print-border',
          paint: {
            'line-color': MAP_COLORS[borderColor],
            'line-width': BORDER_LINE * paper.line,
            ...(borderDashed && { 'line-dasharray': [4, 3] }),
          },
        });
      }

      if (options.territories && options.numbers) {
        map.addSource('print-numbers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: drawn.map((item) => {
              const number = String(item.number ?? '');
              const ring = item.boundary!.map((spot) => {
                const { x, y } = map.project(spot);
                return [x, y] as Spot;
              });
              const { point, room } = roomiest(ring);
              // as big as the sheet allows, but always inside its own
              // borders: a digit is about 0.6 of the size wide
              const size = Math.max(
                4,
                Math.min(
                  12 * paper.line,
                  (room * 1.6) / Math.max(number.length * 0.62, 1),
                  room * 1.4
                )
              );
              return {
                type: 'Feature',
                properties: { number, size },
                geometry: {
                  type: 'Point',
                  coordinates: map.unproject(point).toArray(),
                },
              };
            }),
          },
        });
        map.addLayer({
          id: 'print-numbers',
          type: 'symbol',
          source: 'print-numbers',
          layout: {
            'text-field': ['get', 'number'],
            'text-font': [...MAP_PROVIDERS[DEFAULT_PROVIDER].fonts.number],
            'text-size': ['get', 'size'],
            // every territory gets its number, even where streets are dense
            'text-allow-overlap': true,
          },
          paint: {
            'text-color': '#1F2A66',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': ['*', ['get', 'size'], 0.15],
          },
        });
        labelsAbove(map);
      }
    });

    map.once('idle', () => finish());
    map.on('error', (event) => {
      if (!styled) return finish(false);
      // offline, a missing tile leaves a gap rather than no map at all
      if ('tile' in event || 'sourceId' in event) partial = true;
    });
  });

const OverviewDocument = ({
  image,
  options,
  lang,
}: {
  image: string;
  options: OverviewOptions;
  lang: string;
}) => {
  const { t } = useAppTranslation();

  const paper = sizeOf(options);
  const width = paper.width * POINTS_PER_MM;
  const height = paper.height * POINTS_PER_MM;
  // Surrounding map context keeps the boundaries clear of the printed edges.
  return (
    <Document title={t('tr_territoryTerritoryOverview')} lang={lang}>
      <Page size={{ width, height }} wrap={false}>
        <Image src={image} style={{ width, height, objectFit: 'contain' }} />
      </Page>
    </Document>
  );
};

/** Choose the sheet and what goes on it, then save the map as a PDF. */
export const PrintOverviewDialog = ({
  open,
  onClose,
  territories,
  areas,
  congregation,
  borderColor,
  borderDashed,
}: {
  open: boolean;
  onClose: VoidFunction;
  territories: Territory[];
  areas: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  congregation: TerritoryBoundary | undefined;
  borderColor: MapColor;
  borderDashed: boolean;
}) => {
  const { t } = useAppTranslation();

  const [options, setOptions] = useState<OverviewOptions>({
    format: 'landscape',
    border: true,
    territories: true,
    numbers: true,
    colors: true,
  });
  const [busy, setBusy] = useState(false);
  const locale = useAtomValue(JWLangLocaleState);
  const set = (next: Partial<OverviewOptions>) =>
    setOptions((current) => ({ ...current, ...next }));
  const hasBorder = !!congregation?.length;
  const empty =
    !hasBorder && !territories.some((item) => item.boundary?.length);

  const save = async () => {
    if (busy || empty) return;
    setBusy(true);
    try {
      let partial = false;
      const saved = await exportFile(
        async () => {
          const result = await captureOverview(
            territories,
            areas,
            congregation,
            borderColor,
            borderDashed,
            {
              ...options,
              border: options.border && hasBorder,
            }
          );
          if (!result) throw new Error(t('tr_territoryTheMapCouldNotBeDrawn'));
          partial = result.partial;
          return pdf(
            <OverviewDocument
              image={result.image}
              options={options}
              lang={locale}
            />
          ).toBlob();
        },
        `${t('tr_territoryOverviewFilename')}-${t(FORMAT_LABEL[options.format])}.pdf`
      );
      if (saved && partial) {
        displaySnackNotification({
          header: t('tr_territoryPartsOfTheMapAreMissing'),
          message: t('tr_territorySomeMapTilesCouldNotBeLoadedPrintAgain'),
          severity: 'error',
        });
      }
      if (saved) onClose();
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        displaySnackNotification({
          header: t('tr_territoryExportFailed'),
          message: t((error as Error).message, {
            defaultValue: t(
              'tr_territoryTheTerritoryDocumentCouldNotBeGeneratedTryAgain'
            ),
          }),
          severity: 'error',
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={t('tr_territoryPrintMap')}>
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <Stack spacing="8px">
          <Typography className="label-small-medium" color="var(--grey-400)">
            {t('tr_territoryFormat')}
          </Typography>
          <RadioGroup
            row
            aria-label={t('tr_territoryFormat')}
            value={options.format}
            onChange={(event) => set({ format: event.target.value as Format })}
            sx={{ gap: '0 16px' }}
          >
            {(Object.keys(FORMATS) as Format[]).map((format) => (
              <FormControlLabel
                key={format}
                value={format}
                control={<Radio />}
                label={<Typography>{t(FORMAT_LABEL[format])}</Typography>}
              />
            ))}
          </RadioGroup>
        </Stack>
        <Stack spacing="4px">
          <Checkbox
            label={t('tr_territoryCongregationBorder')}
            checked={options.border && hasBorder}
            disabled={!hasBorder}
            onChange={(event) => set({ border: event.target.checked })}
          />
          <Checkbox
            label={t('tr_allTerritories')}
            checked={options.territories}
            onChange={(event) => set({ territories: event.target.checked })}
          />
          <Checkbox
            label={t('tr_territoryTerritoryNumbers')}
            checked={options.territories && options.numbers}
            disabled={!options.territories}
            onChange={(event) => set({ numbers: event.target.checked })}
          />
          <Checkbox
            label={t('tr_territoryColoursAsOnTheMap')}
            checked={options.territories && options.colors}
            disabled={!options.territories}
            onChange={(event) => set({ colors: event.target.checked })}
          />
        </Stack>
        {empty && (
          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_territoryDrawTheCongregationBorderOrATerritoryFirst')}
          </Typography>
        )}
      </Stack>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={busy || empty}
          onClick={save}
          startIcon={busy ? <IconLoading width={20} height={20} /> : undefined}
        >
          {busy ? t('tr_territoryPreparing') : t('tr_export')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
