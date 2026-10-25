import { territoryRestructureIssue } from '@utils/territory';
import { territoryMapProviderState } from '@states/territory_preferences';
import { useAppTranslation } from '@hooks/index';
import { locateMap } from '@services/maps/location';
import { mapRequest } from '@services/maps/offline';
import {
  applyMapTier,
  downgradeMapTier,
  mapDetail,
  mapPerformanceOptions,
  watchMapPerformance,
} from '@services/maps/performance';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { IconCheckCircle } from '@icons/index';
import { displaySnackNotification } from '@services/states/app';
import { getCSSPropertyValue } from '@utils/common';
import { isDarkThemeState } from '@states/app';
import { store } from '@states/index';
import {
  congregationBorderColorState,
  congregationBorderDashedState,
  congregationBoundaryState,
  territoriesShowDoNotCallMapState,
  territoriesState,
  territoriesWithStatusState,
} from '@states/territories';
import { Territory, TerritoryBoundary } from '@definition/territory';
import { blankTerritory } from '@features/territories/details/useTerritoryDetails';
import { withAssignments } from '@features/territories/helpers';
import { restoreTerritory } from '@features/territories/restore';
import { offerUndo } from '@features/territories/undo';
import {
  MAP_PROVIDERS,
  CONGREGATION_FILL_LAYER,
  CONGREGATION_HIT_LAYER,
  CONGREGATION_LINE_LAYER,
  CONGREGATION_SOURCE,
  CONGREGATION_VEIL_LAYER,
  DEFAULT_BOUNDARY_STYLE,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FILL_LAYER,
  HOVER_LAYER,
  LABEL_CAPTION_LAYER,
  LABEL_LAYER,
  LABELS_SOURCE,
  LINE_LAYER,
  MAP_COLORS,
  SOURCE_ID,
  styleUrl,
} from '@features/territories/map/constants';
import { ColorView, colorScheme } from '@features/territories/map/views';
import {
  CoverageProblems,
  coverageCollection,
  coverageProblems,
} from '@features/territories/map/coverage_check';
import {
  addAttribution,
  addHouseIcon,
  addLabelBackground,
  LABEL_BACKGROUND,
  CAPTION_FILTER,
  CAPTION_TEXT_SIZE,
  captionPlacement,
  captionText,
  LABEL_DETAIL_ZOOM,
  LABEL_FILTER,
  LABEL_TEXT_SIZE,
  labelOpacity,
  numberText,
  resolveColor,
  resolveLightColor,
  allMarkers,
  letterFrames,
  boundaryBounds,
  boundaryCollection,
  congregationBounds,
  drawnColor,
  labelCollection,
  mapLocale,
  sanitizeBoundary,
  closedRing,
  counterClockwise,
} from '@features/territories/map/helpers';
import {
  applyBasemapOptions,
  BasemapOptions,
  DEFAULT_BASEMAP,
  hideStylePlaces,
  labelsAbove,
  labelsBelow,
  LayerSwitch,
  PlaceType,
} from '@features/territories/map/basemap';
import {
  addBoundaryLayers,
  addDoNotCallLayer,
  setDoNotCallData,
  addDrawingLayers,
  FILL_OPACITY,
  setDrawingData,
} from '@features/territories/map/layers';
import {
  MARKER_ICON_ZOOM,
  MarkerRegistry,
  syncMarkers,
} from '@features/territories/map/markers';
import useFullscreen from '@features/territories/map/useFullscreen';
import useMapEditor, {
  EditScope,
} from '@features/territories/map/useMapEditor';
import {
  mergeBoundaries,
  nextNumber,
  splitBoundary,
} from '@features/territories/map/split_merge';
import { TerritoryFields } from '@features/territories/map/split_merge_dialog';

const ZOOM_STEP = 0.5;

// the padding a map keeps around the area it opens on
const FIT_PADDING = 80;

const HOVER_FADE_MS = 140;

const COVERAGE_SOURCE = 'coverage-check';
const COVERAGE_VEIL = 'coverage-check-veil';
const COVERAGE_FILL = 'coverage-check-fill';
const COVERAGE_LINE = 'coverage-check-line';

const SPLIT_SOURCE = 'split-preview';
const SPLIT_FILL = 'split-preview-fill';
const SPLIT_LINE = 'split-preview-line';

// what a split or merge changes beyond the edited territory, kept until Save
type Staged = {
  created: Territory[];
  merged: string[];
  keep?: TerritoryFields;
};

const NOTHING_STAGED: Staged = { created: [], merged: [] };

const NO_PICKS: string[] = [];

// the congregation's outline runs on the outline itself, so it lies exactly
// on the territories' outer borders; a little heavier than theirs, and the
// land outside is dimmed, so the area reads at a glance
const BORDER_LINE: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  9,
  3.5,
  13,
  4.5,
  16,
  5,
];
const VEIL_OPACITY = 0.4;
const WORLD: GeoJSON.Position[] = [
  [-180, -85],
  [180, -85],
  [180, 85],
  [-180, 85],
  [-180, -85],
];

type DialogFields = {
  selected?: Territory;
  takenNumbers: (excluded?: string[]) => string[];
  onConfirm: (fields: TerritoryFields) => void;
  onClose: VoidFunction;
};

const splitFieldsDialog = ({
  selected,
  enabled,
  takenNumbers,
  onConfirm,
  onClose,
}: DialogFields & { enabled: boolean }) => {
  if (!enabled || !selected) return undefined;
  const taken = takenNumbers();
  return {
    initial: {
      number: nextNumber(selected.number, taken),
      city: selected.city,
      name: '',
    },
    taken,
    onConfirm,
    onClose,
  };
};

const mergeFieldsDialog = ({
  selected,
  ids,
  territories,
  staged,
  takenNumbers,
  onConfirm,
  onClose,
}: DialogFields & {
  ids?: string[];
  territories: Territory[];
  staged: Staged;
}) => {
  if (!ids || !selected) return undefined;
  const fieldsOf = ({ number, city, name }: Territory): TerritoryFields => ({
    number,
    city,
    name,
  });
  return {
    initial: staged.keep ?? fieldsOf(selected),
    taken: takenNumbers([selected.id, ...staged.merged, ...ids]),
    choices: [
      selected,
      ...territories.filter((item) => ids.includes(item.id)),
    ].map(fieldsOf),
    onConfirm,
    onClose,
  };
};

const mapViewState = ({
  ready,
  instance,
  editMode,
  editing,
  territories,
  editedId,
  coverage,
}: {
  ready: boolean;
  instance: maplibregl.Map | null;
  editMode: boolean;
  editing: boolean;
  territories: Territory[];
  editedId?: string;
  coverage?: CoverageProblems | null;
}) => ({
  instance: ready ? instance : null,
  mode: editMode ? ('edit' as const) : ('view' as const),
  coverageCounts: coverage
    ? { gaps: coverage.gaps.length, overlaps: coverage.overlaps.length }
    : undefined,
  edited: editing
    ? territories.find((item) => item.id === editedId)
    : undefined,
});

const useTerritoriesMap = () => {
  const { t } = useAppTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const setTerritories = useSetAtom(territoriesState);
  const withStatus = useAtomValue(territoriesWithStatusState);
  const showDoNotCalls = useAtomValue(territoriesShowDoNotCallMapState);

  const territories = useMemo(
    () => withStatus.filter((territory) => territory.type !== 'phone'),
    [withStatus]
  );
  const [congregationBoundary, setCongregationBoundary] = useAtom(
    congregationBoundaryState
  );
  const isDark = useAtomValue(isDarkThemeState);

  const wrapper = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null);
  const markers = useRef<MarkerRegistry>(new Map());
  const style = useRef('');

  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [generation, setGeneration] = useState(0);
  const reloadMap = () => {
    setMapError(false);
    setReady(false);
    setGeneration((value) => value + 1);
  };
  const [styleVersion, setStyleVersion] = useState(0);
  const [colorView, setColorView] = useState<ColorView>('status');
  const [editMode, setEditMode] = useState(false);
  const [borderColor, setBorderColor] = useAtom(congregationBorderColorState);
  const [borderDashed, setBorderDashed] = useAtom(
    congregationBorderDashedState
  );
  const borderDashedRef = useRef(borderDashed);
  borderDashedRef.current = borderDashed;
  const borderColorRef = useRef(borderColor);
  borderColorRef.current = borderColor;
  const editAreaRef = useRef<VoidFunction>(undefined);

  const [heatmapPeriod, setHeatmapPeriod] = useState('last12');

  const scheme = useMemo(
    () => colorScheme(colorView, heatmapPeriod, t),
    [colorView, heatmapPeriod, t]
  );
  const [provider, setProvider] = useAtom(territoryMapProviderState);

  const [layers, setLayers] = useState<BasemapOptions>(DEFAULT_BASEMAP);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showHouseholds, setShowHouseholds] = useState(false);

  const { fullscreen, toggleFullscreen } = useFullscreen(wrapper, map);

  const selectedId = searchParams.get('territory') ?? undefined;
  const selected = territories.find((item) => item.id === selectedId);

  const mapped = territories.filter((item) => item.boundary?.length).length;

  const flyToBoundary = useCallback((boundary: TerritoryBoundary) => {
    const [west, south, east, north] = boundaryBounds(boundary);

    map.current?.fitBounds([west, south, east, north], {
      padding: FIT_PADDING,
      maxZoom: 16,
    });
  }, []);

  const handleEditStart = useCallback(
    (boundary?: TerritoryBoundary) => {
      if (boundary?.length) flyToBoundary(boundary);
    },
    [flyToBoundary]
  );

  const splitLine = useRef<(line: [number, number][]) => void>(undefined);

  const editor = useMapEditor({
    map,
    onStart: handleEditStart,
    onSplitLine: (line) => splitLine.current?.(line),
  });

  // the territories picked to merge with the edited one; a fresh pick list
  // with every tool change
  const [mergePicks, setMergePicks] = useState<string[]>(NO_PICKS);
  const [pickedFor, setPickedFor] = useState(editor.tool);
  if (pickedFor !== editor.tool) {
    setPickedFor(editor.tool);
    setMergePicks(NO_PICKS);
  }
  const merging = editor.editing && editor.tool === 'merge';

  const [staged, setStaged] = useState<Staged>(NOTHING_STAGED);

  const mergeClick = useRef<(id: string) => void>(undefined);
  mergeClick.current = merging
    ? (id) => {
        // a part split off is not saved yet, so there is nothing to merge
        if (!territories.some((item) => item.id === id)) return;
        setMergePicks((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
      }
    : undefined;
  // editing shows every territory in its own colours, not a status
  const shownView: ColorView =
    editMode || editor.editing ? 'original' : colorView;

  const visible = territories;

  const areaPaint = (resolve: (color: string) => string) => {
    const colors = new Map(
      scheme.buckets.map((entry) => [entry.key, resolve(entry.color)])
    );
    return {
      colorOf: (territory: (typeof territories)[number]) =>
        shownView === 'original'
          ? drawnColor(
              (territory.boundaryStyle ?? DEFAULT_BOUNDARY_STYLE).border
            ) || MAP_COLORS.blue
          : (colors.get(scheme.keyOf(territory)) ?? ''),
      fillOf:
        shownView === 'original'
          ? (territory: (typeof territories)[number]) =>
              drawnColor(
                (territory.boundaryStyle ?? DEFAULT_BOUNDARY_STYLE).fill
              )
          : undefined,
    };
  };

  const data = useMemo(() => {
    const hiddenId =
      editor.editing && editor.scope === 'territory' ? selectedId : undefined;

    // until saved, merged territories are gone and split-off parts are there;
    // a merged one's drawings stay, as they go to the territory it joins
    const pending = editor.editing ? staged : NOTHING_STAGED;
    const shown = [
      ...territories.filter((item) => !pending.merged.includes(item.id)),
      ...pending.created,
    ];

    const rest = [...territories, ...pending.created].filter(
      (item) => item.id !== hiddenId
    );

    const detail = mapDetail();
    let borderCoords: TerritoryBoundary | undefined;
    if (congregationBoundary?.length) {
      const boundary = detail.sanitizeGeometry
        ? sanitizeBoundary(congregationBoundary)
        : congregationBoundary;
      borderCoords = counterClockwise(boundary);
    }

    const border: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features:
        borderCoords && !(editor.editing && editor.scope === 'congregation')
          ? [
              {
                type: 'Feature',
                properties: { kind: 'area' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [closedRing(borderCoords)],
                },
              },
              // the world with the area cut out
              {
                type: 'Feature',
                properties: { kind: 'veil' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [WORLD, [...closedRing(borderCoords)].reverse()],
                },
              },
            ]
          : [],
    };

    return {
      border,
      areas: boundaryCollection(shown, {
        ...areaPaint(resolveColor),
        detailOf: scheme.detailOf,
        selectedId,
        hiddenId,
      }),
      rest,
      selectedId,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    territories,
    congregationBoundary,
    editor.editing,
    editor.scope,
    selectedId,
    scheme,
    shownView,
    isDark,
    staged,
  ]);

  const basemap = useRef({ provider, layers });
  basemap.current = { provider, layers };

  const labelOptions = useRef({ showNumbers, showHouseholds, provider });
  labelOptions.current = { showNumbers, showHouseholds, provider };

  const dataRef = useRef(data);
  dataRef.current = data;

  const setSelectedId = useCallback(
    (id?: string) => {
      setSearchParams(id ? { territory: id } : {}, { replace: true });
    },
    [setSearchParams]
  );

  // in edit mode a picked territory opens straight in the editor
  const [pendingEdit, setPendingEdit] = useState<string>();

  const pickTerritory = useCallback(
    (id?: string) => {
      setSelectedId(id);
      if (editMode && id) setPendingEdit(id);
    },
    [editMode, setSelectedId]
  );

  const pickRef = useRef(pickTerritory);
  pickRef.current = pickTerritory;

  // layers live on the style, so they are re-applied whenever the style is swapped
  const applyLayers = useCallback(() => {
    const instance = map.current;
    if (!instance || instance.getSource(SOURCE_ID)) return;

    const current = dataRef.current;

    addHouseIcon(instance, getCSSPropertyValue('--black')).catch(console.error);
    addLabelBackground(
      instance,
      getCSSPropertyValue('--white'),
      getCSSPropertyValue('--accent-200')
    );

    const detail = mapDetail();

    instance.addSource(CONGREGATION_SOURCE, {
      type: 'geojson',
      data: current.border,
      tolerance: detail.tolerance,
      buffer: detail.buffer,
      maxzoom: detail.sourceMaxZoom,
    });
    instance.addSource(SOURCE_ID, {
      type: 'geojson',
      data: current.areas,
      // the territory id names each feature, so hover can mark it
      promoteId: 'id',
      tolerance: detail.tolerance,
      buffer: detail.buffer,
      maxzoom: detail.sourceMaxZoom,
    });
    instance.addSource(LABELS_SOURCE, {
      type: 'geojson',
      data: labelCollection(current.areas, {
        households: labelOptions.current.showHouseholds,
      }),
    });

    const isArea: maplibregl.FilterSpecification = [
      '==',
      ['get', 'kind'],
      'area',
    ];

    instance.addLayer({
      id: CONGREGATION_VEIL_LAYER,
      type: 'fill',
      source: CONGREGATION_SOURCE,
      filter: ['==', ['get', 'kind'], 'veil'],
      paint: {
        'fill-color': getCSSPropertyValue('--white'),
        'fill-opacity': VEIL_OPACITY,
      },
    });

    instance.addLayer({
      id: CONGREGATION_FILL_LAYER,
      type: 'fill',
      source: CONGREGATION_SOURCE,
      filter: isArea,
      paint: {
        'fill-color': getCSSPropertyValue('--accent-main'),
        'fill-opacity': 0.06,
      },
    });

    addBoundaryLayers(instance, SOURCE_ID, {
      fill: FILL_LAYER,
      line: LINE_LAYER,
    });

    // above the territories' borders, which it shares its path with
    instance.addLayer({
      id: CONGREGATION_LINE_LAYER,
      type: 'line',
      source: CONGREGATION_SOURCE,
      filter: isArea,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': MAP_COLORS[borderColorRef.current],
        'line-width': BORDER_LINE,
        // weak devices draw it solid; dashes cost them frames
        ...(detail.dashedBorder &&
          borderDashedRef.current && { 'line-dasharray': [4, 3] }),
      },
    });

    // a wide, invisible band over the outline, so it's easy to hit in edit mode
    instance.addLayer({
      id: CONGREGATION_HIT_LAYER,
      type: 'line',
      source: CONGREGATION_SOURCE,
      filter: isArea,
      paint: { 'line-width': 16, 'line-opacity': 0 },
    });

    // the territory under the pointer deepens in its own colour (status,
    // heatmap or drawn fill; the border's colour when it has none); `hover`
    // runs 0 to 1, eased in and out below
    instance.addLayer(
      {
        id: HOVER_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': [
            'case',
            ['!=', ['coalesce', ['get', 'fill'], ''], ''],
            ['get', 'fill'],
            ['get', 'color'],
          ],
          // picked to merge, it stays deep
          'fill-opacity': [
            'max',
            ['*', ['number', ['feature-state', 'hover'], 0], 0.35],
            ['case', ['boolean', ['feature-state', 'picked'], false], 0.6, 0],
          ],
        },
      },
      LINE_LAYER
    );

    addDrawingLayers(instance, current.rest, 'drawing', current.selectedId);
    addDoNotCallLayer(instance);

    // with 150+ territories the overview keeps to borders and numbers
    if (detail.drawingZoom) {
      for (const layer of instance.getStyle().layers) {
        if (layer.id.startsWith('drawing-')) {
          instance.setLayerZoomRange(layer.id, detail.drawingZoom, 24);
        }
      }
    }

    const fonts = MAP_PROVIDERS[labelOptions.current.provider].fonts;
    const caption = captionPlacement(labelOptions.current.showNumbers);

    // the caption goes first, so the number badge draws on top of it
    instance.addLayer({
      id: LABEL_CAPTION_LAYER,
      type: 'symbol',
      source: LABELS_SOURCE,
      minzoom: LABEL_DETAIL_ZOOM + detail.captionDelay,
      filter: CAPTION_FILTER,
      layout: {
        'text-field': captionText(labelOptions.current, fonts),
        'text-font': [...fonts.regular],
        'text-size': CAPTION_TEXT_SIZE,
        'text-line-height': 1.2,
        'text-anchor': caption.anchor,
        'text-offset': caption.offset,
        // its own badge would hide it; captionZoom keeps the neighbours clear
        'text-allow-overlap': true,
        'symbol-sort-key': ['get', 'labelZoom'],
      },
      paint: {
        'text-opacity': labelOpacity(1, 'captionZoom'),
        'text-color': getCSSPropertyValue('--black'),
        // a thin, softened halo keeps small text readable over any tile
        'text-halo-color': getCSSPropertyValue('--white'),
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5,
      },
    });

    instance.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: LABELS_SOURCE,
      filter: LABEL_FILTER,
      layout: {
        visibility: labelOptions.current.showNumbers ? 'visible' : 'none',
        'text-field': numberText(fonts),
        'text-font': [...fonts.number],
        'text-size': LABEL_TEXT_SIZE,
        'text-line-height': 1.15,
        'text-allow-overlap': false,
        'icon-image': LABEL_BACKGROUND,
        'icon-text-fit': 'both',
        // the glyph box isn't the ink: the font keeps room above capitals
        // and a wider bearing on the left, so the badge is padded to centre
        // the ink itself (measured within half a pixel)
        'icon-text-fit-padding': [0, 4.5, 2, 3.5],
        'icon-allow-overlap': false,
        // the biggest territories claim their place first
        'symbol-sort-key': ['get', 'labelZoom'],
      },
      paint: {
        'text-color': getCSSPropertyValue('--black'),
        'text-opacity': labelOpacity(1),
        'icon-opacity': labelOpacity(0.92),
      },
    });

    labelsAbove(instance);
  }, []);

  useEffect(() => {
    if (!container.current || map.current) return;

    style.current = styleUrl(provider, isDark);

    // a map with nothing picked opens on the congregation's own area
    const area = congregationBounds(territories, congregationBoundary);

    let instance: maplibregl.Map;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: style.current,
        ...(area
          ? { bounds: area, fitBoundsOptions: { padding: FIT_PADDING } }
          : { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }),
        transformRequest: mapRequest,
        attributionControl: false,
        locale: mapLocale(),
        ...mapPerformanceOptions(),
      });
    } catch {
      setMapError(true);
      return;
    }
    // reloading opens the map a step lighter, so it fits the next time
    instance.on('webglcontextlost', () => {
      downgradeMapTier();
      setMapError(true);
      setReady(false);
    });
    instance.on('webglcontextrestored', () => {
      applyMapTier(instance);
      setMapError(false);
      setReady(true);
    });
    watchMapPerformance(instance);

    addAttribution(instance);

    instance.scrollZoom.setWheelZoomRate(1 / 900);
    instance.scrollZoom.setZoomRate(1 / 200);

    map.current = instance;

    // 'style.load' is the first point a custom layer is accepted, and it fires
    // again after the theme swaps the basemap
    instance.on('style.load', () => {
      applyBasemapOptions(
        instance,
        basemap.current.provider,
        basemap.current.layers
      );
      applyLayers();
      setReady(true);
      setStyleVersion((version) => version + 1);
    });

    instance.on('click', FILL_LAYER, (event: maplibregl.MapLayerMouseEvent) => {
      if (editor.active.current) {
        const id = event.features?.[0]?.properties?.id;
        if (typeof id === 'string') mergeClick.current?.(id);
        return;
      }
      // in edit mode a click on the outline takes the whole area, not the
      // territory under it
      if (
        editAreaRef.current &&
        instance.queryRenderedFeatures(event.point, {
          layers: [CONGREGATION_HIT_LAYER],
        }).length
      )
        return;

      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'string') pickRef.current(id);
    });

    instance.on('mouseenter', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = 'pointer';
    });

    // a quick fade in and out: feature state doesn't animate by itself
    let hovered: string | number | undefined;
    const fades = new Map<string | number, number>();
    const fade = (id: string | number, to: number) => {
      cancelAnimationFrame(fades.get(id) ?? 0);
      const from = Number(
        instance.getFeatureState({ source: SOURCE_ID, id }).hover ?? 0
      );
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / HOVER_FADE_MS, 1);
        const eased = 1 - (1 - t) ** 3;
        instance.setFeatureState(
          { source: SOURCE_ID, id },
          { hover: from + (to - from) * eased }
        );
        if (t < 1) fades.set(id, requestAnimationFrame(step));
        else fades.delete(id);
      };
      fades.set(id, requestAnimationFrame(step));
    };
    const unhover = () => {
      if (hovered === undefined) return;
      fade(hovered, 0);
      hovered = undefined;
    };
    instance.on(
      'mousemove',
      FILL_LAYER,
      (event: maplibregl.MapLayerMouseEvent) => {
        // while a shape is being drawn, the pointer belongs to the tool
        const id =
          editor.active.current && !mergeClick.current
            ? undefined
            : event.features?.[0]?.id;
        if (id === hovered) return;
        unhover();
        if (id === undefined) return;
        hovered = id;
        fade(id, 1);
      }
    );

    // in edit mode the congregation's outline is something to pick, like a
    // territory: a click opens it
    instance.on('click', CONGREGATION_HIT_LAYER, () => {
      if (editor.active.current) return;
      editAreaRef.current?.();
    });
    instance.on('mouseenter', CONGREGATION_HIT_LAYER, () => {
      if (!editAreaRef.current || editor.active.current) return;
      instance.getCanvas().style.cursor = 'pointer';
    });
    instance.on('mouseleave', CONGREGATION_HIT_LAYER, () => {
      instance.getCanvas().style.cursor = '';
    });

    instance.on('mouseleave', FILL_LAYER, () => {
      instance.getCanvas().style.cursor = '';
      unhover();
    });

    const registry = markers.current;

    return () => {
      syncMarkers(instance, [], registry);
      instance.remove();
      map.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  useEffect(() => {
    if (!map.current || !ready) return;
    map.current.setPaintProperty(
      CONGREGATION_LINE_LAYER,
      'line-color',
      MAP_COLORS[borderColor]
    );
    map.current.setPaintProperty(
      CONGREGATION_LINE_LAYER,
      'line-dasharray',
      borderDashed && mapDetail().dashedBorder ? [4, 3] : undefined
    );
  }, [borderColor, borderDashed, ready, styleVersion]);

  useEffect(() => {
    if (!map.current || !ready) return;

    applyBasemapOptions(map.current, provider, layers);
    // the basemap lifts its street names to the top; the numbers go back over them
    for (const id of [LABEL_CAPTION_LAYER, LABEL_LAYER]) {
      if (map.current.getLayer(id)) map.current.moveLayer(id);
    }
  }, [provider, layers, ready, styleVersion]);

  // looking at the map, the street names come first; drawing, the lines do
  const drawing = editMode || editor.editing;
  useEffect(() => {
    if (!map.current || !ready) return;

    if (drawing) labelsBelow(map.current, CONGREGATION_VEIL_LAYER);
    else labelsAbove(map.current);
  }, [drawing, provider, layers, ready, styleVersion]);

  // swapping the style drops every other layer, terra draw's too, so only on a real basemap change
  useEffect(() => {
    const next = styleUrl(provider, isDark);

    if (!map.current || !ready || next === style.current) return;

    style.current = next;
    map.current.setStyle(next);
  }, [isDark, provider, ready]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    const source = (id: string) =>
      instance.getSource(id) as maplibregl.GeoJSONSource | undefined;

    source(CONGREGATION_SOURCE)?.setData(data.border);
    source(SOURCE_ID)?.setData(data.areas);
    source(LABELS_SOURCE)?.setData(
      labelCollection(data.areas, { households: showHouseholds })
    );
    setDrawingData(instance, data.rest, 'drawing', data.selectedId);
    setDoNotCallData(instance, showDoNotCalls ? territories : []);
    // the territory being edited is out of data.rest; its notes come from the draft
    const drafted = editor.editing ? editor.draft.markers : [];
    instance.getContainer().dataset.editing = editor.editing ? '1' : '';
    const updateMarkers = () => {
      const bounds = instance.getBounds();
      const { markerDelay, maxMarkers } = mapDetail();
      // the edited territory's own pins and notes show at any zoom, as chips
      // rather than bare points
      const others =
        instance.getZoom() < MARKER_ICON_ZOOM + markerDelay
          ? []
          : allMarkers(data.rest);
      const items = [...others, ...drafted]
        .filter((item) => bounds.contains(item.position))
        .slice(0, maxMarkers);
      syncMarkers(
        instance,
        items,
        markers.current,
        editor.selected === undefined ? undefined : String(editor.selected),
        letterFrames(data.rest)
      );
    };
    updateMarkers();
    instance.on('moveend', updateMarkers);

    // without this the first frame can stay empty until something else moves
    instance.triggerRepaint();
    return () => {
      instance.off('moveend', updateMarkers);
    };
  }, [
    data,
    ready,
    showHouseholds,
    showDoNotCalls,
    territories,
    editor.editing,
    editor.draft.markers,
    editor.selected,
  ]);

  // while one territory is edited the rest step back, so the drawing stands out
  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion) return;

    // the whole area's outline needs the territories quiet underneath it;
    // a single territory keeps its neighbours readable
    let fade = 1;
    if (editor.editing) fade = editor.scope === 'congregation' ? 0.2 : 0.5;

    const set = (
      layer: string,
      property: Parameters<maplibregl.Map['setPaintProperty']>[1],
      value: Parameters<maplibregl.Map['setPaintProperty']>[2]
    ) => {
      if (instance.getLayer(layer)) {
        instance.setPaintProperty(layer, property, value);
      }
    };

    set(FILL_LAYER, 'fill-opacity', ['*', fade, FILL_OPACITY]);
    set(LINE_LAYER, 'line-opacity', fade);
    set(CONGREGATION_FILL_LAYER, 'fill-opacity', 0.06 * fade);
    set(CONGREGATION_LINE_LAYER, 'line-opacity', fade);
    set(CONGREGATION_VEIL_LAYER, 'fill-opacity', VEIL_OPACITY * fade);
    set('drawing-shapes-fill', 'fill-opacity', 0.35 * fade);

    for (const layer of [
      'drawing-shapes-line',
      'drawing-shapes-line-dashed',
      'drawing-lines-solid-selected',
      'drawing-lines-dashed-selected',
    ]) {
      set(layer, 'line-opacity', fade);
    }
    set('drawing-lines-solid', 'line-opacity', labelOpacity(fade));
    set('drawing-lines-dashed', 'line-opacity', labelOpacity(fade));

    set(LABEL_LAYER, 'text-opacity', labelOpacity(fade));
    set(LABEL_LAYER, 'icon-opacity', labelOpacity(0.92 * fade));
    set(LABEL_CAPTION_LAYER, 'text-opacity', labelOpacity(fade, 'captionZoom'));
  }, [editor.editing, editor.scope, styleVersion]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion) return;

    hideStylePlaces(instance);
  }, [styleVersion]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion || !instance.getLayer(LABEL_LAYER)) return;

    const fonts = MAP_PROVIDERS[provider].fonts;
    const caption = captionPlacement(showNumbers);

    instance.setLayoutProperty(
      LABEL_LAYER,
      'visibility',
      showNumbers ? 'visible' : 'none'
    );
    instance.setLayoutProperty(LABEL_LAYER, 'text-field', numberText(fonts));
    instance.setLayoutProperty(LABEL_LAYER, 'text-font', [...fonts.number]);

    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-field',
      captionText({ showHouseholds }, fonts)
    );
    instance.setLayoutProperty(LABEL_CAPTION_LAYER, 'text-font', [
      ...fonts.regular,
    ]);
    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-anchor',
      caption.anchor
    );
    instance.setLayoutProperty(
      LABEL_CAPTION_LAYER,
      'text-offset',
      caption.offset
    );
  }, [showNumbers, showHouseholds, provider, styleVersion]);

  // gaps and overlaps: everything else washes out, so only they stand out.
  // Only while choosing what to edit; editing anything ends it
  const [coverageCheck, setCoverageCheck] = useState(false);
  const coverageOn = coverageCheck && editMode && !editor.editing;

  const coverage = useMemo(() => {
    if (!coverageOn) return undefined;
    try {
      return coverageProblems(congregationBoundary, territories);
    } catch (error) {
      // a self-crossing border can defeat the geometry; better no check
      console.error('coverage check failed', error);
      return null;
    }
  }, [coverageOn, congregationBoundary, territories]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion || !coverage) return;

    instance.addSource(COVERAGE_SOURCE, {
      type: 'geojson',
      data: coverageCollection(coverage),
    });
    const before = instance.getLayer(LABEL_CAPTION_LAYER)
      ? LABEL_CAPTION_LAYER
      : undefined;
    const problemColor: maplibregl.ExpressionSpecification = [
      'match',
      ['get', 'kind'],
      'gap',
      MAP_COLORS.red,
      MAP_COLORS.purple,
    ];
    instance.addLayer(
      {
        id: COVERAGE_VEIL,
        type: 'fill',
        source: COVERAGE_SOURCE,
        filter: ['==', ['get', 'kind'], 'veil'],
        paint: {
          'fill-color': getCSSPropertyValue('--white'),
          'fill-opacity': 0.75,
        },
      },
      before
    );
    instance.addLayer(
      {
        id: COVERAGE_FILL,
        type: 'fill',
        source: COVERAGE_SOURCE,
        filter: ['!=', ['get', 'kind'], 'veil'],
        paint: { 'fill-color': problemColor, 'fill-opacity': 0.45 },
      },
      before
    );
    instance.addLayer(
      {
        id: COVERAGE_LINE,
        type: 'line',
        source: COVERAGE_SOURCE,
        filter: ['!=', ['get', 'kind'], 'veil'],
        paint: { 'line-color': problemColor, 'line-width': 2 },
      },
      before
    );

    return () => {
      // the style may have been swapped underneath in the meantime
      if (!instance.getStyle()) return;
      for (const id of [COVERAGE_LINE, COVERAGE_FILL, COVERAGE_VEIL]) {
        if (instance.getLayer(id)) instance.removeLayer(id);
      }
      if (instance.getSource(COVERAGE_SOURCE)) {
        instance.removeSource(COVERAGE_SOURCE);
      }
    };
  }, [coverage, styleVersion]);

  const picked = merging ? mergePicks : NO_PICKS;

  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion || !instance.getSource(SOURCE_ID)) return;

    for (const id of picked) {
      instance.setFeatureState({ source: SOURCE_ID, id }, { picked: true });
    }
    return () => {
      if (!instance.getStyle() || !instance.getSource(SOURCE_ID)) return;
      for (const id of picked) {
        instance.setFeatureState({ source: SOURCE_ID, id }, { picked: false });
      }
    };
  }, [picked, styleVersion]);

  const [splitting, setSplitting] = useState<{
    larger: TerritoryBoundary;
    smaller: TerritoryBoundary;
  }>();
  const [mergeTarget, setMergeTarget] = useState<{
    boundary: TerritoryBoundary;
    ids: string[];
  }>();

  // the part that will become a new territory, while its number is asked for
  useEffect(() => {
    const instance = map.current;
    if (!instance || !styleVersion || !splitting) return;

    instance.addSource(SPLIT_SOURCE, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [splitting.smaller] },
      },
    });
    instance.addLayer({
      id: SPLIT_FILL,
      type: 'fill',
      source: SPLIT_SOURCE,
      paint: { 'fill-color': MAP_COLORS.orange, 'fill-opacity': 0.45 },
    });
    instance.addLayer({
      id: SPLIT_LINE,
      type: 'line',
      source: SPLIT_SOURCE,
      paint: { 'line-color': MAP_COLORS.orange, 'line-width': 3 },
    });

    return () => {
      if (!instance.getStyle()) return;
      for (const id of [SPLIT_LINE, SPLIT_FILL]) {
        if (instance.getLayer(id)) instance.removeLayer(id);
      }
      if (instance.getSource(SPLIT_SOURCE)) instance.removeSource(SPLIT_SOURCE);
    };
  }, [splitting, styleVersion]);

  useEffect(() => {
    if (!ready || !selected?.boundary?.length) return;

    flyToBoundary(selected.boundary);
  }, [selectedId, ready, selected?.boundary, flyToBoundary]);

  // set when editing was opened from a territory's page, so saving goes back there
  const returnTo = useRef<string>(undefined);

  // a step that would throw away unsaved drawing waits here for a confirmation
  const [pendingLeave, setPendingLeave] = useState<VoidFunction>();

  const editingId = useRef<string>(undefined);

  const startEditing = useCallback(
    (scope: EditScope = 'territory') => {
      if (scope === 'territory' && !selected) return;

      setStaged(NOTHING_STAGED);
      setSplitting(undefined);
      setMergeTarget(undefined);
      // the drawing belongs to this territory, whatever gets picked meanwhile
      editingId.current = scope === 'territory' ? selected?.id : undefined;

      editor.start(
        scope,
        selected,
        congregationBoundary,
        borderColor,
        borderDashed
      );
    },
    [editor, selected, congregationBoundary, borderColor, borderDashed]
  );

  // set while edit mode waits for a pick, so a click on the outline opens it
  editAreaRef.current =
    editMode && !editor.editing
      ? () => startEditing('congregation')
      : undefined;

  const editRequested = searchParams.get('edit') === '1';

  useEffect(() => {
    if (!ready || !editRequested || !selected || editor.editing) return;

    returnTo.current = `/territories/${selected.id}`;

    setSearchParams({ territory: selected.id }, { replace: true });
    startEditing('territory');
  }, [
    ready,
    editRequested,
    selected,
    editor.editing,
    setSearchParams,
    startEditing,
  ]);

  const goBack = useCallback(() => {
    const target = returnTo.current;
    returnTo.current = undefined;

    if (target) navigate(target);

    return !!target;
  }, [navigate]);

  const cancelEditing = useCallback(() => {
    editor.finish();
    goBack();
  }, [editor, goBack]);

  const dirty =
    editor.dirty || staged.created.length > 0 || staged.merged.length > 0;

  const requestLeave = useCallback(
    (action: VoidFunction) => {
      if (dirty) setPendingLeave(() => action);
      else action();
    },
    [dirty]
  );

  // the breadcrumb's step up: from a territory to the whole area's outline
  const editArea = useCallback(
    () =>
      requestLeave(() => {
        editor.finish();
        startEditing('congregation');
      }),
    [requestLeave, editor, startEditing]
  );

  const confirmLeave = useCallback(() => {
    pendingLeave?.();
    setPendingLeave(undefined);
  }, [pendingLeave]);

  useEffect(() => {
    if (!pendingEdit || selected?.id !== pendingEdit || editor.editing) return;

    setPendingEdit(undefined);
    startEditing('territory');
  }, [pendingEdit, selected, editor.editing, startEditing]);

  const isEditMode = editMode || editor.editing;

  const setMode = useCallback(
    (mode: 'view' | 'edit') => {
      if (mode === 'edit') {
        setEditMode(true);
        return;
      }

      const leave = () => {
        if (editor.editing) cancelEditing();
        setEditMode(false);
      };

      requestLeave(leave);
    },
    [editor.editing, cancelEditing, requestLeave]
  );

  // Abbrechen and Esc, one level at a time; the model is written up in useMapEditor
  const leaveTerritory = useCallback(
    () =>
      requestLeave(() => {
        editor.finish();
        if (!goBack()) setSelectedId(undefined);
      }),
    [editor, goBack, requestLeave, setSelectedId]
  );

  const stepBack = useCallback(() => {
    if (!editor.editing) setEditMode(false);
    else if (!editor.leaveTool()) leaveTerritory();
  }, [editor, leaveTerritory]);

  // an open dialog, or full screen, takes Esc first
  useEffect(() => {
    if (!isEditMode || pendingLeave || editor.labelling !== undefined) return;
    if (fullscreen || splitting || mergeTarget) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;

      stepBack();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    isEditMode,
    pendingLeave,
    editor.labelling,
    fullscreen,
    splitting,
    mergeTarget,
    stepBack,
  ]);

  // numbers a new or merged territory can't take
  const takenNumbers = (except: string[] = []) => [
    ...withStatus
      .filter((item) => !except.includes(item.id))
      .map((item) => item.number),
    ...staged.created.map((item) => item.number),
  ];

  splitLine.current = (line) => {
    const boundary = editor.draft.boundary;
    if (!boundary?.length) return;

    const result = splitBoundary(boundary, line);
    if ('error' in result) {
      displaySnackNotification({
        header: t('tr_territoryTerritoryNotSplit'),
        message: t('tr_territoryDrawOneLineStraightAcrossTheTerritory'),
        severity: 'error',
      });
      return;
    }
    setSplitting(result);

    // the dialog sits low, so the part it asks about shows above it
    const instance = map.current;
    if (!instance) return;
    const [west, south, east, north] = boundaryBounds(boundary);
    const height = instance.getContainer().clientHeight;
    instance.fitBounds([west, south, east, north], {
      padding: {
        top: FIT_PADDING,
        left: FIT_PADDING,
        right: FIT_PADDING,
        bottom: Math.min(360, height / 2),
      },
      maxZoom: 17,
    });
  };

  const confirmSplit = (fields: TerritoryFields) => {
    if (!splitting || !selected) return;

    editor.replaceBoundary(splitting.larger);
    setStaged((prev) => ({
      ...prev,
      created: [
        ...prev.created,
        {
          ...blankTerritory(),
          ...fields,
          type: selected.type,
          categories: selected.categories,
          notes: selected.notes,
          warning: selected.warning,
          boundary: splitting.smaller,
          boundaryStyle: editor.boundaryStyle,
        },
      ],
    }));
    setSplitting(undefined);
  };

  const mergePicked = () => {
    const boundary = editor.draft.boundary;
    if (!boundary?.length || mergePicks.length === 0) return;

    const others = territories.filter((item) => mergePicks.includes(item.id));
    const result = mergeBoundaries(
      boundary,
      others.map((item) => item.boundary ?? [])
    );

    if ('error' in result) {
      displaySnackNotification({
        header: t('tr_territoryTerritoriesNotMerged'),
        message:
          result.error === 'apart'
            ? t('tr_territoryOnlyNeighbouringTerritoriesCanBeMerged')
            : t('tr_territoryTheMergedTerritoryWouldEncloseAnotherOne'),
        severity: 'error',
      });
      return;
    }
    setMergeTarget({ boundary: result.boundary, ids: mergePicks });
  };

  const confirmMerge = (fields: TerritoryFields) => {
    if (!mergeTarget) return;

    editor.replaceBoundary(mergeTarget.boundary);
    setStaged((prev) => ({
      ...prev,
      merged: [...prev.merged, ...mergeTarget.ids],
      keep: fields,
    }));
    setMergeTarget(undefined);
  };

  const splitDialog = splitFieldsDialog({
    selected,
    enabled: !!splitting,
    takenNumbers,
    onConfirm: confirmSplit,
    onClose: () => setSplitting(undefined),
  });
  const mergeDialog = mergeFieldsDialog({
    selected,
    ids: mergeTarget?.ids,
    territories,
    staged,
    takenNumbers,
    onConfirm: confirmMerge,
    onClose: () => setMergeTarget(undefined),
  });

  const save = useCallback(() => {
    const { draft, scope } = editor;

    if (!draft.boundary?.length) return;

    if (scope === 'congregation') {
      setCongregationBoundary(draft.boundary);
      if (editor.boundaryStyle.border !== 'transparent') {
        setBorderColor(editor.boundaryStyle.border);
      }
      setBorderDashed(!!editor.boundaryStyle.dashed);

      displaySnackNotification({
        header: t('tr_territoryCongregationBorderSaved'),
        message: t('tr_territoryTheOuterBorderOfTheCongregationWasUpdated'),
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    } else if (editingId.current) {
      const id = editingId.current;
      const before = store.get(territoriesState);
      const original = before.find((item) => item.id === id);
      const absorbed = before.filter((item) => staged.merged.includes(item.id));
      const issue = territoryRestructureIssue(
        before,
        id,
        staged.merged,
        staged.created,
        staged.keep?.number
      );
      const errorKey =
        issue === 'number'
          ? 'tr_territoryThisNumberIsAlreadyUsed'
          : 'tr_territoryReturnBeforeRestructuring';
      if (issue || !original) {
        displaySnackNotification({
          header: t('tr_territoryMapNotSaved'),
          message: t(errorKey),
          severity: 'error',
        });
        return;
      }

      setTerritories((prev) => [
        ...staged.created,
        ...prev
          .filter((item) => !staged.merged.includes(item.id))
          .map((item) => {
            if (item.id !== id) return item;

            const next: Territory = {
              ...item,
              ...staged.keep,
              households:
                item.households +
                absorbed.reduce((sum, other) => sum + other.households, 0),
              categories: [
                ...new Set([
                  ...item.categories,
                  ...absorbed.flatMap((other) => other.categories),
                ]),
              ],
              notes:
                [
                  ...new Set(
                    [
                      item.notes,
                      ...absorbed.map((other) => other.notes),
                    ].filter(Boolean)
                  ),
                ].join('\n\n') || undefined,
              warning:
                [
                  ...new Set(
                    [
                      item.warning,
                      ...absorbed.map((other) => other.warning),
                    ].filter(Boolean)
                  ),
                ].join('\n') || undefined,
              phoneNumbers: [
                ...new Set([
                  ...(item.phoneNumbers ?? []),
                  ...absorbed.flatMap((other) => other.phoneNumbers ?? []),
                ]),
              ],
              cardLost:
                item.cardLost || absorbed.some((other) => other.cardLost),
              reviewNeeded:
                item.reviewNeeded ||
                absorbed.some((other) => other.reviewNeeded),
              boundary: draft.boundary,
              boundaryStyle: draft.boundaryStyle,
              mapShapes: [
                ...draft.shapes,
                ...absorbed.flatMap((other) => other.mapShapes ?? []),
              ],
              mapLines: [
                ...draft.lines,
                ...absorbed.flatMap((other) => other.mapLines ?? []),
              ],
              mapMarkers: [
                ...draft.markers,
                ...absorbed.flatMap((other) => other.mapMarkers ?? []),
              ],
              doNotCalls: [
                ...item.doNotCalls,
                ...absorbed.flatMap((other) => other.doNotCalls),
              ],
            };

            return absorbed.length
              ? withAssignments(next, [
                  ...item.assignments,
                  ...absorbed.flatMap((other) => other.assignments),
                ])
              : next;
          }),
      ]);

      const number = staged.keep?.number ?? original?.number;

      const undoText = absorbed.length
        ? t('tr_territoryTerritoriesMergedInto', { number })
        : t('tr_territoryTerritorySplit', { number });
      if (absorbed.length || staged.created.length) {
        const createdIds = new Set(staged.created.map((item) => item.id));
        const restored = [original, ...absorbed]
          .map((item) => ({ item, index: before.indexOf(item) }))
          .sort((a, b) => a.index - b.index);

        offerUndo({
          text: undoText,
          revert: () => {
            store.set(territoriesState, (prev) =>
              prev.filter((item) => !createdIds.has(item.id))
            );
            for (const { item, index } of restored) {
              restoreTerritory(item, index);
            }
          },
        });
      } else {
        displaySnackNotification({
          header: t('tr_territoryMapSaved'),
          message: t('tr_territoryTheMapOfTerritoryWasSaved', {
            number,
          }),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });
      }
    }

    editor.finish();
    setStaged(NOTHING_STAGED);

    if (!goBack()) setSelectedId(undefined);
  }, [
    editor,
    staged,
    setBorderColor,
    setBorderDashed,
    setTerritories,
    setCongregationBoundary,
    goBack,
    setSelectedId,
    t,
  ]);

  const locate = useCallback(() => {
    locateMap()
      .then(({ longitude, latitude }) => {
        map.current?.flyTo({ center: [longitude, latitude], zoom: 15 });
      })
      .catch(() =>
        displaySnackNotification({
          header: t('tr_territoryLocationUnavailable'),
          message: t('tr_territoryTheDeviceDidNotShareItsPosition'),
          severity: 'error',
        })
      );
  }, [t]);

  const fitAll = useCallback(() => {
    const drawn = territories
      .filter((item) => item.boundary?.length)
      .flatMap((item) => item.boundary as TerritoryBoundary);

    const all = [...drawn, ...(congregationBoundary ?? [])];

    if (all.length > 0) flyToBoundary(all);
  }, [territories, congregationBoundary, flyToBoundary]);

  return {
    mapError,
    reloadMap,
    wrapper,
    container,
    ...mapViewState({
      ready,
      instance: map.current,
      editMode: isEditMode,
      editing: editor.editing,
      territories,
      editedId: editingId.current,
      coverage,
    }),
    territories: visible,
    mapped,
    selected,
    selectedId,
    pickTerritory,
    setMode,
    colorView,
    setColorView,
    legend: scheme.buckets,
    // the territories in the colours shown, as they look on white paper
    printAreas: () =>
      boundaryCollection(territories, {
        ...areaPaint(resolveLightColor),
        detailOf: scheme.detailOf,
        sanitize: false,
      }),
    heatmapPeriod,
    setHeatmapPeriod,
    provider,
    setProvider,
    layers,
    setLayer: (key: LayerSwitch, value: boolean) =>
      setLayers((prev) => ({ ...prev, [key]: value })),
    togglePlaceType: (type: PlaceType) =>
      setLayers((prev) => ({
        ...prev,
        placeTypes: prev.placeTypes.includes(type)
          ? prev.placeTypes.filter((item) => item !== type)
          : [...prev.placeTypes, type],
      })),
    showNumbers,
    setShowNumbers,
    showHouseholds,
    setShowHouseholds,
    fullscreen,
    toggleFullscreen,
    zoomIn: () => map.current?.zoomTo(map.current.getZoom() + ZOOM_STEP),
    zoomOut: () => map.current?.zoomTo(map.current.getZoom() - ZOOM_STEP),
    locate,
    fitAll,
    coverageCheck: coverageOn,
    toggleCoverageCheck: () => setCoverageCheck((on) => !on),
    editor,
    startEditing,
    editArea,
    leaveTerritory,
    stepBack,
    pendingLeave: !!pendingLeave,
    confirmLeave,
    keepEditing: () => setPendingLeave(undefined),
    save,
    mergeCount: picked.length,
    mergePicked,
    splitDialog,
    mergeDialog,
  };
};

export type TerritoriesMapState = ReturnType<typeof useTerritoriesMap>;

export default useTerritoriesMap;
